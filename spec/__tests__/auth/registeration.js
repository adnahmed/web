const { setupDB, api, shutdown } = require('../../utils/context')
const { gql, request } = require('graphql-request')
const config = require('../../../src/config').graphql

describe('Registeration Tests', () => {
    beforeAll(() => {
        api()
    })

    afterAll( done => {
        shutdown()
        done()
    })

    beforeEach(() => {
        setupDB()
    })
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
    const user = {
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

    test('Register Administrator', async () => {
        const data = await request(config.endpoint, register, { user })
        expect(data).toHaveProperty('register.token')
        expect(data).toHaveProperty('register.user')
        expect(data.register).toMatchObject({
            code: 200,
            message: "Registeration Successful",
            success: true,
        })
    })

    it('fails to register with same username already registered.', async () => {
        const newUser = await request(config.endpoint, register, { user }) // New Registeration
        const data = await request(config.endpoint, register, { user })
        expect(data.register).toMatchObject({
            code: 403,
            message: `User already exists: username: ${user.username}, email: ${user.email}`,
            success: false,
        })
    })
})
