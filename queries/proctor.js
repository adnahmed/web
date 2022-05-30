const AllQueries = {
  createProctor:
    "create table if not exists proctors (\
        administrator bigint references administrators(administrator_id), \
        username text not null unique,\
        password text not null,\
        first_name varchar(255) not null, last_name varchar(255) not null, \
        name text generated always as (first_name || ' ' || last_name) stored\
        )",
    select: {
      administratorUsernamePasswordWhereUsername: "Select administrator, username, password from proctors where username = $1"
    },
    insert: {
      usernamePasswordNameReturning: "insert into proctors (administrator, username, password, first_name, last_name) values ($1, $2, $3, $4, $5) RETURNING *"
    },
    truncateProctors:
        "truncate table proctors cascade",
};

module.exports = AllQueries;
