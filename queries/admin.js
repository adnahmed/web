const AllQueries = {
    createAdministrator: "Create table administrators (administrator_id bigserial primary key, \
        username varchar(50) not null unique, password text not null)",
    insertAdministrator: "Insert into administrators(username, password) values ($1, $2)",
    insertAdministratorReturning: "Insert into administrators(username, password) values ($1, $2) RETURNING *",
    selectUsernamePassword: "Select username, password from administrators",
    selectUsernamePasswordWhereUsername: "Select username, password from administrators where username = $1::text",
    selectPasswordWhereAdministratorId: "Select password from administrators where administrator_id = $1",
    truncateAdministrators: "truncate table administrators",
}

module.exports = AllQueries;