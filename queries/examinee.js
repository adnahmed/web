const AllQueries = {
  createExaminee:
    "create table if not exists examinees (\
            administrator bigint references administrators(administrator_id) on delete cascade, \
            username varchar(255) not null, \
            password varchar(255) not null, \
            first_name varchar(255) not null, last_name varchar(255) not null, \
            name text generated always as (first_name || ' ' || last_name) stored,\
            primary key (administrator, username)\
        )",

  truncateExaminees: "truncate table examinees cascade",
  dropExaminee: "drop table if exists examinees cascade",
  select: {
    administratorUsernamePassword:
      "select administrator, username, password from examinees",
    usernamePasswordWhereUsername:
      "Select username, password from examinees where username = $1",
    administratorUsernamePasswordWhereUsername:
      "Select administrator, username, password from examinees where username = $1",
  },
  insert: {
    usernamePasswordNameReturning:
      "insert into examinees (administrator, username, password, first_name, last_name) values ($1, $2, $3, $4, $5) RETURNING *",
  },
  delete: {
    whereUsernameAndAdministratorReturning: "delete from examinees where (username, administrator) = ($1 ,$2) returning username, name"
  }
};
module.exports = AllQueries;
