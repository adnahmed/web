const AllQueries = {
    createExaminee: "create if not exists table examinees (examinee_id bigserial primary key, administor_id bigint references administrators, username varchar(255) unique, password varchar(255), first_name varchar(255), last_name varchar(255))",
    truncateExaminees: "truncate table examinees",
};
module.exports = AllQueries;