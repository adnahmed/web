match (admin: User { username: $sub })-[:MANAGES]-(proctor: User { role: 'proctor'})
return proctor