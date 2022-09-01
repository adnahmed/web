const { setupDB } = require('../../utils/context')
describe('Registeration Tests', () => {
    beforeEach(() => {
        setupDB()
    })

    test('2 + 2 equals 4', () => {
        expect(1 + 2).toBe(4)
    })

    test('2 + 2 does not equal 3', () => {
        expect(2 + 3).not.toBe(3)
    })
})
