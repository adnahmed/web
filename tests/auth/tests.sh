
# TODO: Add Assertions to Tests 
echo "* -- Registeration Test -- *"

curl --request POST \
                                                             --header 'content-type: application/json' \
                                                             --url http://localhost:3001/graphql \
                                                             --data '{"query":" mutation Register($user: UserRegisterationInput!) {register(user: $user) {code token message success user {prefix givenName middleName lastName role} }}","variables":{"user":{"username":"adnan","password":"password","role":"administrator","givenName":"adnan","email":"mailtoadnan@adnan.com", "organization":"CABI"}}}'

echo "* -- Login Username Test -- *"

http POST :3001/graphql "query= query logInUsername { logInUsername(username: \"adnan\" , password: \"password\") { __typename code message success user {prefix givenName middleName lastName role}}}"

echo "* -- Login Email Test -- *"

http POST :3001/graphql "query= query logInEmail { logInEmail(email: \"mailtoadnan@adnan.com\" , password: \"password\") { __typename code message success user {prefix givenName middleName lastName role}}}"


