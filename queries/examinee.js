const AllQueries = {
    createExaminee: "create table examinee (username varchar(255) primary key, password varchar(255), first_name varchar(255), last_name varchar(255))",
    truncateExaminees: "truncate table examinee",
};
module.exports = AllQueries;