const { setupDB, api, shutdown } = require('../../utils/context')
const { request } = require('graphql-request')
const { user } = require('../../utils/constants')
const { register } = require('../../utils/queries')

describe('Registeration Tests', () => {
    beforeAll(() => {
        api()
    })

    afterAll((done) => {
        shutdown()
        done()
    })

    beforeEach(async () => {
        await setupDB()
    })
    
    test('Register User', async () => {
        const data = await request(process.env.GraphQLEndpoint, register, { user })
        expect(data).toHaveProperty('register.token')
        expect(data).toHaveProperty('register.user')
        expect(data.register.queryResponse).toMatchObject({
            code: 200,
            message: 'Registeration Successful',
            success: true,
        })
    })

    it('fails to register with same username/email already registered.', async () => {
        await request(process.env.GraphQLEndpoint, register, { user }) // New Registeration
        const userWithSameUsername = {
            ...user,
            email: 'different.address@mail.com',
        }
        const dataSameUsername = await request(process.env.GraphQLEndpoint, register, {
            user: userWithSameUsername,
        })
        expect(dataSameUsername.register.queryResponse).toMatchObject({
            code: 403,
            message: `User already exists: username: ${user.username}, email: ${userWithSameUsername.email}`,
            success: false,
        })
        const userWithSameEmail = {
            ...user,
            username: 'otherusername',
        }
        const dataSameEmail = await request(process.env.GraphQLEndpoint, register, {
            user: userWithSameEmail,
        })
        expect(dataSameEmail.register.queryResponse).toMatchObject({
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
            await request(process.env.GraphQLEndpoint, register, { user: fakeRole })
        } catch (err) {
            expect(err.response.errors[0]).toMatchObject({
                extensions: {
                    code: 'BAD_USER_INPUT',
                },
            })
        }
    })

    it('fails to register with invalid input', async () => {
        const invalidUser = {
            username: 'l337_P4N$A',
            password: 'password',
            role: 'administrator',
            prefix: 'K3.',
            givenName: 'H4CK366',
            middleName: 'M1D',
            email: 'add223.232@d.com',
            organization: 'FUCKS',
        }
        const data = await request(process.env.GraphQLEndpoint, register, {
            user: invalidUser,
        })
        expect(data.register.queryResponse).toMatchObject({
            code: 400,
            message: `Please avoid using using profanity in Organization.\n\"username\" must contain only alphanumeric characters`,
            success: false,
        })
    })

    it('registers with minimal inputs required for user', async () => {
    const minimalUser = {
        username: 'username',
        password: 'password',
        role: 'administrator',
        givenName: 'givenName',
        email: 'address@domain.com',
        organization: 'organization',
    }
        const data = await request(process.env.GraphQLEndpoint, register, { user: minimalUser })
        expect(data).toHaveProperty('register.token')
        expect(data).toHaveProperty('register.user')
        expect(data.register.queryResponse).toMatchObject({
            code: 200,
            message: 'Registeration Successful',
            success: true,
        })
    })
})
