const { getUser, Roles } = require('../graphql/auth_utils');
const express = require('express');
const neo4j = require('../db/neo4j');
const cypher = require('../db/cypher');
const router = express.Router();
const send = require('send');
const formidable = require('formidable');
// const {createNecessaryDirectoriesSync} = require('filesac');
router.get('/current', async (req, res) => {
    const { status, user } = await getUser(req);
    if (!status) res.status(403).send("Unauthorized access not allowed.")
    if (!user.role || !Roles.values().includes(user.role)) res.status(403).send("Unauthorized request made, only proctors, examinees and administrators are allowed.")
    if (user.role == Roles.administrator || user.role == Roles.proctor) {
        const examineeId = req.headers.userId;
        if(!examineeId) res.status(400).send("Examinee Id not provided. Cannot retrieve exam");
        const getExamineeRes = await neo4j.read(cypher("get-user-by-id"), {
            id: examineeId
        });
        if (getExamineeRes.records.length == 0) res.send(404).send("Examinee Not Found");
        const doesUserManagesOrProcotorExamineeRes = await neo4j.read(cypher("does-user-manages-or-proctor-examinee"),{
            userId: user.id,
            examineeId: examineeId
        });
        if(!doesUserManagesOrProcotorExamineeRes.records[0].get(0)) {
            res.status(403).send("User does not manage examinee and not authorized access to exam paper.");
        }
    }
    const getExamResponse = await neo4j.read(cypher("get-exam-by-examinee"), {
       id: user.id,
       date: Date.now()
    });
    if (getExamResponse.records.length == 0) res.status(404).send("No Current Exam Found. Please try again later.");
    const examPath = getExamResponse.records[0].get(0).properties.path;
    send(req, examPath, {root: __dirname + '/blobs'})   
        .pipe(res);
});

router.post('/', async (req, res) => {
    const { status, user } = await getUser(req);

    if (!status) res.status(403).send("Unauthorized access not allowed.")
    if (!user.role || user.role != Roles.administrator) res.status(403).send("Unauthorized request made, only administrators are allowed.")

    const examGroupId = req.headers.examGroupId;
    const examStartDate = req.headers.startDate;
    const examEndDate = req.headers.endDate;
    const examName = req.headers.name;

    if (!examGroupId || !examStartDate || !examEndDate || !examName) res.status(400).send("Invalid Request Format, exam startDate, endDate, Name and examGroup id must be provided.")

    const doesUserManagesExamGroupRes = await neo4j.read(cypher("does-user-manages-examGroup"),{
            userId: user.id,
            examGroupId: examGroupId
        });

    if(!doesUserManagesExamGroupRes.records[0].get(0)) {
        res.status(403).send("User does not manage examGroup and not authorized access to exam paper.");
    }

    const examAlreadyExistsRes = await neo4j.read(cypher("get-exam-by-name"), {
        name: examName
    });

    var alreadyExists = false;
    var exam = null;
    if (examAlreadyExistsRes.records.length != 0) {
        // if it does then does it fall between start and end time.
        exam = examAlreadyExistsRes.records[0].get(0).properties;
        if (exam.startDate == examStartDate || exam.endDate == exam.endDate) res.status(400).send("Cannot create duplicate exam that coincide in time.");
        alreadyExists = true;
    }

    const uploadPath = __dirname + '/blobs';
    // createNecessaryDirectoriesSync(`${uploadPath}/x`); // TODO: replace with custom/prebuild functionality. Cannot import module due to CommonJS and ES6 incompatibility
    const form = formidable({
        uploadDir: uploadPath,
        keepExtensions: true,
        minFileSize: 100,
        maxFiles: 1,
        filename: (name, ext, part, form) => { return examName; },
        filter: function ({name, originalFilename, mimetype}) {
            // keep pdf files.
            return mimetype && mimetype.includes("application/pdf");
        }
    });
  
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).send("Server Error Occurred. File Upload Unsuccessful.");
      }
      if (alreadyExists) {
        await neo4j.write(cypher("set-new-exam-link-to-examGroup"), {
            examId: exam.id,
            groupId: examGroupId,
            startDate: examStartDate,
            endDate: examEndDate
        });
      } else {
        await neo4j.write(cypher("add-new-exam-to-examGroup"), {
            name: examName,
            groupId: examGroupId,
            path: examName,
            startDate: examStartDate,
            endDate: examEndDate
        });
      }
    });
  });
  
  module.exports = router;
