const { setupDB, api, shutdown, registerFakeAccount, getAuthenticatedAccount } = require('../../utils/context')
const { request, GraphQLClient } = require('graphql-request')
const { createExam, loginUsername } = require('../../utils/queries')
const { exam, user } = require('../../utils/constants')

describe('Exam Tests', ()=> {

    beforeAll(() => {
        api()
    })

    afterAll((done) => {
        shutdown()
        done()
    })

    beforeEach(async () => {
        await setupDB()
        await registerFakeAccount()
    })

    test('Create exam after login from administrator', async ()=> {
           const authenticatedClient = await getAuthenticatedAccount()
           const data = await authenticatedClient.request(createExam, { exam })
            expect(data.createExam).toMatchObject({
                code: 200,
                message: 'Exam Created.',
                success: true
            })
    })

    it('fails to create exam when unauthenticated.', async ()=> {
        try {
            await request(process.env.GraphQLEndpoint, createExam, { exam: exam })
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