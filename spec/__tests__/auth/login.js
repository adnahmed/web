const { setupDB, api, shutdown } = require('../../utils/context')
const { gql, request } = require('graphql-request')
const config = require('../../../src/config').graphql
const { register, user } = require('../../utils/constants')

describe('Login Tests', () => {
    beforeAll(() => {
        api()
    })

    afterAll((done) => {
        shutdown()
        done()
    })

    beforeEach(async () => {
        setupDB()
        await registerFakeAccount()
    })

    test('Login User', async () => {
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
        const usernameLoginData = await request(
            config.endpoint,
            loginUsername,
            {
                username: user.username,
                password: user.password,
            }
        )
        expect(usernameLoginData).toHaveProperty('logInUsername.token')
        expect(usernameLoginData).toHaveProperty('logInUsername.user')
        expect(usernameLoginData.logInUsername).toMatchObject({
            code: 200,
            message: 'Login Successful',
            success: true,
        })

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
        const emailLoginData = await request(config.endpoint, loginEmail, {
            email: user.email,
            password: user.password,
        })
        expect(emailLoginData).toHaveProperty('logInEmail.token')
        expect(emailLoginData).toHaveProperty('logInEmail.user')
        expect(emailLoginData.logInEmail).toMatchObject({
            code: 200,
            message: 'Login Successful',
            success: true,
        })
    })
})

async function registerFakeAccount() {
    await request(config.endpoint, register, { user })
}
