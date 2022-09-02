/**
 * User Definition
 */
module.exports = {
    id: {
        primary: true,
        type: 'uuid',
        required: true, // Exists constraint in Enterprise mode.
    },
    username: {
        type: 'string',
        index: true,
        unique: 'true', // Unique Constraint
    },
    email: {
        type: 'string',
        index: true,
        unique: 'true',
    },
    password: {
        type: 'string'
    },
    role: {
        type: 'string',
    },
    prefix: 'string',
    givenName: 'string',
    middleName: 'string',
    lastName: 'string',

    belongs_to: {
        type: 'relationship',
        relationship: 'BELONGS_TO',
        direction: 'out',
        target: 'Organization',
    },
    createdAt: {
        type: 'datetime',
        default: () => new Date,
    },
}