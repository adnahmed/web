const { setupDB, api } = require('../../utils/context')
const { gql, request } = require('graphql-request')
const config = require('../../../src/config').graphql

describe('Registeration Tests', () => {
    beforeAll(() => {
        api()
    })
    beforeEach(() => {
        setupDB()
    })

    test('Register Administrator', async () => {
     
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
        expect(data).toHaveProperty('register.token')
        expect(data).toHaveProperty('register.user')
        expect(data.register).toMatchObject({
            code: 200,
            message: "Registeration Successful",
            success: true,
        })
    })
})
