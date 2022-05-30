const AllQueries = {
  createExaminee:
    "create table if not exists examinees (\
            administrator bigint references administrators(administrator_id), \
            username varchar(255) not null, \
            password varchar(255) not null, \
            first_name varchar(255) not null, last_name varchar(255) not null, \
            name text generated always as (first_name || ' ' || last_name) stored,\
            primary key (administrator, username)\
        )",

  truncateExaminees: "truncate table examinees cascade",
  select: {
    administratorUsernamePassword:
      "select administrator, username, password from examinees",
    usernamePasswordWhereUsername:
      "Select username, password from examinees where username = $1",
    administratorUsernamePasswordWhereUsername:
      "Select administrator, username, password from examinees where username = $1",
  },
  insert: {
    usernamePassword:
      "insert into examinees (administrator, username, password) values ($1, $2, $3)",
    usernamePasswordReturning:
      "insert into examinees (administrator, username, password) values ($1, $2, $3) RETURNING *",
    usernamePasswordName:
      "insert into examinees (administrator, username, password, first_name, last_name) values ($1, $2, $3, $4, $5)",
    usernamePasswordNameReturning:
      "insert into examinees (administrator, username, password, first_name, last_name) values ($1, $2, $3, $4, $5) RETURNING *",
  },
};
module.exports = AllQueries;
