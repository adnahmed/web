const { gql } = require('graphql-request')
const register = gql`
    mutation Register($user: UserRegisterationInput!) {
        register(user: $user) {
            code
            token
            message
            success
            user {
                id
                prefix
                givenName
                middleName
                lastName
                role
            }
        }
    }
`
const user = {
    username: 'username',
    password: 'password',
    role: 'administrator',
    prefix: ' ',
    givenName: 'givenName',
    middleName: 'middleName',
    lastName: 'lastName',
    email: 'address@domain.com',
    organization: 'organization',
}

const loginEmail = gql`
    query login($email: EmailAddress!, $password: String!) {
        logInEmail(email: $email, password: $password) {
            code
            message
            success
            token
            user {
                id
            }
        }
    }
`
const loginUsername = gql`
    query login($username: String!, $password: String!) {
        logInUsername(username: $username, password: $password) {
            code
            message
            success
            token
            user {
                id
            }
        }
    }
`

module.exports = {
    register,
    user,
    loginEmail,
    loginUsername
}
