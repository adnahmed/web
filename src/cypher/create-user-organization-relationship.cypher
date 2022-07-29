merge (org:Organization { name: $organization})
on create set org.createdAt = time()
on match set org.lastUpdated = time()
with org
match (user:User {username : $username})
merge (user)-[:BELONGS_TO]->(org)