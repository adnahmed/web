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

module.exports = {
    register,
    user
}
