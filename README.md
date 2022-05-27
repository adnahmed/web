# Node.js Backend for RPS
This repository holds the backend code for rps that handles authentication and file upload/download for RPS.

It is used in conjunction with [rps-codeless](https://github.com/adnahmed/rps-codeless) and [nginx](https://www.nginx.com) reverse proxy to deliver a complete API 
for [rps-iOS](https://github.com/adnahmed/rps-iOS) and [rpsp-macCatalyst](https://github.com/adnahmed/rpsp-macCatalyst).

## Running 
To run the project, create a `config.js` file such as
```
modules.export = [
  secret : 'your-secret-here'
]
```
then install [postgres](https://www.postgresql.org) and set [environment variables](https://www.postgresql.org/docs/9.1/libpq-envars.html) 
as used by libpq i.e. `PGUSER`, `PGDATABASE`, `PGHOST`, `PGPORT`. Note that some environment variables have default values and can be ignored.
After that just run,
`npm run run` to start the server.
