const { setupDB, api, shutdown } = require('../../utils/context')
const { gql, request } = require('graphql-request')
const config = require('../../../src/config').graphql

describe('Registeration Tests', () => {
    beforeAll(() => {
        api()
    })

    afterAll((done) => {
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

    test('Register User', async () => {
        const data = await request(config.endpoint, register, { user })
        expect(data).toHaveProperty('register.token')
        expect(data).toHaveProperty('register.user')
        expect(data.register).toMatchObject({
            code: 200,
            message: 'Registeration Successful',
            success: true,
        })
    })

    it('fails to register with same username/email already registered.', async () => {
        await request(config.endpoint, register, { user }) // New Registeration
        const userWithSameUsername = {
            ...user,
            email: 'different.address@mail.com',
        }
        const dataSameUsername = await request(config.endpoint, register, {
            user: userWithSameUsername,
        })
        expect(dataSameUsername.register).toMatchObject({
            code: 403,
            message: `User already exists: username: ${user.username}, email: ${userWithSameUsername.email}`,
            success: false,
        })
        const userWithSameEmail = {
            ...user,
            username: 'other.username',
        }
        const dataSameEmail = await request(config.endpoint, register, {
            user: userWithSameEmail,
        })
        expect(dataSameEmail.register).toMatchObject({
            code: 403,
            message: `User already exists: username: ${userWithSameEmail.username}, email: ${user.email}`,
            success: false,
        })
    })

    it('fails to register with unknown role.', async () => {
        var fakeRole = {
            ...user,
            role: 'unknown',
        }
        try {
            await request(config.endpoint, register, { user: fakeRole })
        } catch (err) {
            expect(err.response.errors[0]).toMatchObject({
                extensions: {
                    code: 'BAD_USER_INPUT',
                },
            })
        }
    })
})
