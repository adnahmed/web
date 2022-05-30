const AllQueries = {
    createExaminee: "create if not exists table examinees (examinee_id bigserial primary key, administor_id bigint references administrators, username varchar(255) unique, password varchar(255), first_name varchar(255), last_name varchar(255))",
    truncateExaminees: "truncate table examinees",
    select: {
        administratorUsernamePassword: "select administrator, username, password from examinees",
    },
    insert: {
        examineeUsernamePassword: "insert into examinees (administerator, username, password) values ($1, $2, $3)"
    }
};
module.exports = AllQueries;