const AllQueries = {
    createAdministrator: "Create table administrators (administrator_id bigserial primary key, \
        username varchar(50) not null unique, password varchar(50) not null)",
    insertAdministrator: "Insert into administrators(username, password) values ($1, $2)",
    insertAdministratorReturning: "Insert into administrators(username, password) values ($1, $2) RETURNING *",
    selectUsernamePassword: "Select username, password from administrators",
    selectUsernamePasswordWhereUsername: "Select username, password from administrators where username = $1::text",
    truncateAdministrators: "truncate table administrators",
}

module.exports = AllQueries;