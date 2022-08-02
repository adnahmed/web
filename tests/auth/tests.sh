
# TODO: Add Assertions to Tests 
echo "* -- Registeration Test -- *"

curl --request POST \
                                                             --header 'content-type: application/json' \
                                                             --url http://localhost:3001/graphql \
                                                             --data '{"query":" mutation Register($user: UserRegisterationInput!) {register(user: $user) {code token message success user {prefix givenName middleName lastName role} }}","variables":{"user":{"username":"adnan","password":"password","role":"administrator","givenName":"adnan","email":"mailtoadnan@adnan.com"}}}'

echo "* -- Login Test -- *"

http POST :3001/graphql "query= query logIn { logIn(username: \"adnan\" , password: \"password\") { __typename code message success user {prefix givenName middleName lastName role}}}"


