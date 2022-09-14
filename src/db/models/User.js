/**
 * User Definition
 */
module.exports = {
    id: {
        primary: true,
        type: 'uuid',
        required: true, // Exists constraint in Enterprise mode.
        optional: false,
    },
    username: {
        type: 'string',
        index: true,
        unique: 'true', // Unique Constraint
        required: true,
        optional: false,
    },
    email: {
        type: 'string',
        index: true,
        unique: 'true',
        required: true,
        optional: false,
    },
    password: {
        type: 'string',
        required: true,
        optional: false,
    },
    role: {
        type: 'string',
        allow: ['administrator', 'proctor', 'examinee'],
        required: true,
        optional: false,
    },
    prefix: {
        type: 'string',
        optional: true,
        allow: [''],
        default: () => ''
    },
    givenName: {
        type: 'string',
        required: true,
        optional: false,
    },
    middleName: {
        type: 'string',
        optional: true,
        allow: [''],
        default: () => ''
    },
    lastName: {
        type: 'string',
        optional: true,
        allow: [''],
        default: () => ''
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