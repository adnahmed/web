match (u:User {
    username: $username
})-[:`IS`]-(r:Role)
return r.type