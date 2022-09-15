const neo4j = require('../../db/neo4j')
const { ErrorQueryResponse, OKQueryResponse } = require('../utils')
module.exports = {
    Query: {
        getMCQExam: async (parent, args, context) => {
            try {
                let query = neo4j.instance.query()
                let mcqExamRecords = await query.match('m', 'MCQExam')
                    .relationship('BELONGS_TO','out')
                    .to('e','Exam')
                    .where('e.id', args.exam)
                    .return('m')
                    .execute()
                
                return {
                    mcqExam: mcqExamRecords.records.pop(),
                    queryResponse: new OKQueryResponse()
                }
            } catch (err) {
                return new ErrorQueryResponse(err)
            }
        }
    }
}