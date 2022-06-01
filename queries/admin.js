const AllQueries = {
    createAdministrator: "Create table  if not exists administrators (\
        administrator_id bigserial primary key, \
        username varchar(50) not null unique, \
        password text not null, \
        first_name varchar(255) not null, last_name varchar(255) not null, \
        name text generated always as (first_name || ' ' || last_name) stored)",
    insert : {
        usernamePassword: "Insert into administrators(username, password) values ($1, $2)",
        usernamePasswordReturning: "Insert into administrators(username, password) values ($1, $2) RETURNING *",
        usernamePasswordName: "Insert into administrators(username, password, first_name, last_name) values ($1, $2, $3, $4) ",
        usernamePasswordNameReturning: "Insert into administrators(username, password, first_name, last_name) values ($1, $2, $3, $4) RETURNING *",
    },
    select : {
        usernamePassword: "select username, password from administrators",
        idUsernamePasswordWhereUsername: "select administrator_id,username, password from administrators where username = $1",
        passwordWhereAdministratorId: "Select password from administrators where administrator_id = $1",
    },
    delete: {
        whereUsername: "delete from administrators where username = $1 returning username",
        whereAdministratorId: "delete from administrators where administrator_id = $1 returning username"
    },
    truncateAdministrators: "truncate table administrators cascade",
    dropAdministrator: "drop table if exists administrators cascade"
}

module.exports = AllQueries;