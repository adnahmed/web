/**
 * Picture Definition
 */
 module.exports = {
    id: {
        primary: true,
        type: 'uuid',
        required: true,
    },
    path: {
        type: 'uuid',
        unique: 'true',
        required: true,
    },
    meta: {
        type: 'String',
        optional: true
    },
    createdAt: {
        type: 'datetime',
        default: () => new Date,
    },
    belongs_to: {
        type: 'relationship',
        relationship: 'BELONGS_TO',
        direction: 'out',
        target: 'User',
    },
}