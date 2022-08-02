create (u:User {
        prefix: coalesce('', $prefix),
        givenName: $givenName,
        middleName: coalesce($middleName, ''),
        lastName: coalesce($lastName, ''),
        email: $email,
        username: $username,
        password: $password,
        createdAt: time()
    }
)
return u