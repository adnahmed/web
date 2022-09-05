const { gql } = require('graphql-request')

const USER_FIELDS = `
        id
        prefix
        givenName
        middleName
        lastName
        role
`

const register = gql`
    mutation Register($user: UserRegisterationInput!) {
        register(user: $user) {
            queryResponse {
              code
              message
              success
            }
            token
            user {
              ${USER_FIELDS}
            }
        }
    }
`
const unregister = gql`
{
    mutation unregister($id: UUID!) {
  unregister(id: $id) {
    queryResponse {
      code
      message
      success
    }
  }
}
}
`
const loginEmail = gql`
    query login($email: EmailAddress!, $password: String!) {
        logInEmail(email: $email, password: $password) {
            queryResponse {
              code
              message
              success
            }
            token
            user {
              ${USER_FIELDS}
            }
        }
    }
`
const loginUsername = gql`
    query login($username: String!, $password: String!) {
        logInUsername(username: $username, password: $password) {
            queryResponse {
              code
              message
              success
            }
            token
            user {
              ${USER_FIELDS}
            }
        }
    }
`

module.exports = {
    register,
    unregister,
    loginEmail,
    loginUsername,
}
