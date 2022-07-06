create (u:User:Administrator
    {
    prefix: coalesce('', $prefix),
    given_name: $given_name,
    middle_name: coalesce($middle_name, ''),
    last_name: coalesce($last_name, ''),
    email: $email
    username: $username,
    password: $password,
    createdAt: time()
    }
)
return u