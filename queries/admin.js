const AllQueries = {
    insertAdministrator: "Insert into administrators(username, password) values ($1, $2)",
    insertAdministratorReturning: "Insert into administrators(username, password) values ($1, $2) RETURNING *"
}

module.exports = AllQueries;