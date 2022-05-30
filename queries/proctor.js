const AllQueries = {
  createProctor:
    "create table if not exists proctor (\
        administrator bigint references administrators(administrator_id), \
        username text not null unique,\
        password text not null,\
        first_name varchar(255) not null, last_name varchar(255) not null, \
        name text generated always as (first_name || ' ' || last_name) stored\
        )",
};

module.exports = AllQueries;
