const AllQueries = {
    
    createExaminee: "create table if not exists examinees (examinee_id bigserial primary key not null, administrator bigint references administrators(administrator_id), username varchar(255) unique not null, \
        password varchar(255) not null, first_name varchar(255), last_name varchar(255), name text generated always as \
        (first_name || ' ' || last_name) stored)",
    
    truncateExaminees: "truncate table examinees cascade",
    select: {
        administratorUsernamePassword: "select administrator, username, password from examinees",
    },
    insert: {
        usernamePassword: "insert into examinees (administrator, username, password) values ($1, $2, $3)",
        usernamePasswordReturning: "insert into examinees (administrator, username, password) values ($1, $2, $3) RETURNING *"
    }
};
module.exports = AllQueries;