const { setupDB, api, shutdown } = require('../../utils/context')
const { request } = require('graphql-request')
const config = require('../../../src/config').graphql
const { register, loginEmail, loginUsername } = require('../../utils/queries')
const { user } = require('../../utils/constants')

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
        expect(usernameLoginData.logInUsername.queryResponse).toMatchObject({
            code: 200,
            message: 'Login Successful',
            success: true,
        })

        
        const emailLoginData = await request(config.endpoint, loginEmail, {
            email: user.email,
            password: user.password,
        })
        expect(emailLoginData).toHaveProperty('logInEmail.token')
        expect(emailLoginData).toHaveProperty('logInEmail.user')
        expect(emailLoginData.logInEmail.queryResponse).toMatchObject({
            code: 200,
            message: 'Login Successful',
            success: true,
        })
    })
    it('fails on invalid password.', async () => {
        const usernameLoginData = await request(
            config.endpoint,
            loginUsername,
            {
                username: user.username,
                password: 'invalidPassword',
            }
        )
        expect(usernameLoginData.logInUsername.queryResponse).toMatchObject({
            code: 403,
            message: 'Invalid Password Provided.',
            success: false,
        })
        
        const emailLoginData = await request(config.endpoint, loginEmail, {
            email: user.email,
            password: 'invalidPassword',
        })

        expect(emailLoginData.logInEmail.queryResponse).toMatchObject({
            code: 403,
            message: 'Invalid Password Provided.',
            success: false,
        })
    })

    it('fails on invalid email/username.', async () => {
        const usernameLoginData = await request(
            config.endpoint,
            loginUsername,
            {
                username: 'invalidUsername',
                password: user.password,
            }
        )
        expect(usernameLoginData.logInUsername.queryResponse).toMatchObject({
            code: 403,
            message: 'Invalid Email or Username provided.',
            success: false,
        })
        
        const emailLoginData = await request(config.endpoint, loginEmail, {
            email: 'invalidEmail@dom.com',
            password: user.password,
        })

        expect(emailLoginData.logInEmail.queryResponse).toMatchObject({
            code: 403,
            message: 'Invalid Email or Username provided.',
            success: false,
        })
    })
})

async function registerFakeAccount() {
    await request(config.endpoint, register, { user })
}
