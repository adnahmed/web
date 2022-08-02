create index user_index_username if not exists for (u:User) on (u.username)
create index organization_index_name if not exists for (o:Organization) on (o.name)