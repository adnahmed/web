const { setupDB, api, shutdown, registerFakeAccount } = require('../../utils/context')
const { request } = require('graphql-request')
const config = require('../../../src/config').graphql
const { createExam } = require('../../utils/queries')
const { exam } = require('../../utils/constants')

describe('Exam Tests', ()=> {

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

    it('fails to create exam when unauthenticated.', async ()=> {
        try {
            await request(config.endpoint, createExam, { exam: exam })
        } catch (err) {
            expect(err.response.errors[0].extensions).toMatchObject({
                exception: {
                    code: 403,
                    message: "You are unauthorized to perform this action.",
                    success: false
                }
            })
        }
    })
})