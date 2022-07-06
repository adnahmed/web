merge (org:Organization { name: $organization})
on create set org.createdAt = time()
on match set org.lastUpdated = time()
with org
match (admin:Administrator {username : $username})
merge (admin)-[:BELONGS_TO]->(org)