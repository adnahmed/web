merge (role:Role { type: $role})
with role
match (user:User {username : $username})
merge (user)-[:IS]->(role)