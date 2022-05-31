const AllQueries = {
  createProctor:
    "create table if not exists proctors (\
        administrator bigint references administrators(administrator_id) on delete cascade, \
        username text not null,\
        password text not null,\
        first_name varchar(255) not null, last_name varchar(255) not null, \
        name text generated always as (first_name || ' ' || last_name) stored,\
        primary key (administrator, username)\
        )",
    dropProctor: "drop table if exists proctors cascade",
    select: {
      administratorUsernamePasswordWhereUsername: "Select administrator, username, password from proctors where username = $1"
    },
    insert: {
      usernamePasswordNameReturning: "insert into proctors (administrator, username, password, first_name, last_name) values ($1, $2, $3, $4, $5) RETURNING *"
    },
    delete: {
      whereUsernameAndAdministratorReturning: "delete from proctors where (username, administrator) = ($1 ,$2) returning username, name"
    },
    truncateProctors:
        "truncate table proctors cascade",
};

module.exports = AllQueries;
