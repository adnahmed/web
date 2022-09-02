/**
 * Organization Definition
 */
module.exports = {
    id: {
        primary: true,
        type: 'uuid',
        required: 'true',
    },
    name: {
        type: 'String',
        unique: 'true'
    },
    createdAt: {
        type: 'datetime',
        default: () => new Date,
    },
}