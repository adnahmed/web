const { setupDB } = require('../../utils/context')
const { gql, request } = require('graphql-request')
const config = require('../../../src/config').graphql

describe('Registeration Tests', () => {
    beforeEach(() => {
        setupDB()
    })

    test('Register Administrator', async () => {
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
            }`

        const register = userDetails + gql`
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
        const data = await request(config.endpoint, register, {
            user: {
                username: "username",
                password: "password",
                role: "administrator",
                prefix: " ",
                givenName: "givenName",
                middleName: "middleName",
                lastName: "lastName",
                email: "address@domain.com",
                organization: "organization"
            }
        })
        expect(data).toHaveProperty('token')
        expect(data).toHaveProperty('user')
        expect(data).toMatchObject({
            code: 200,
            message: "Registeration Successful",
            success: true,
        })
    })
})
