const { gql, request } = require('graphql-request')

const userDetails = gql`
    {
        fragment
        UserDetails
        on
        User {
            id
            prefix
            givenName
            middleName
            lastName
            role
        }
    }
`
const register = gql`
{
    mutation Register($user: UserRegisterationInput!) {
  register(user: $user) {
    code
    token
    message
    success
    user {
        ...UserDetails
    }
  }
}
}`

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

module.exports = {
    userDetails,
    register,
    unregister,
}
