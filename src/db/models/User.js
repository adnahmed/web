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
        allow: ['administrator', 'proctor', 'examinee']
    },
    prefix: {
        type: 'string',
        optional: true,
    },
    givenName: {
        type: 'string',
        required: true,
    },
    middleName: {
        type: 'string',
        optional: true,
    },
    lastName: {
        type: 'string',
        optional: true,
    },
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