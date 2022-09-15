/**
 * Subject Definition
 */
 module.exports = {
    id: {
        primary: true,
        type: 'uuid',
        required: true, // Exists constraint in Enterprise mode.
        optional: false,
    },
    name: {
        required: true,
        optional: false,
        type: 'string'
    },
    meta: {
        allows: [''],
        type: 'string'
    },
    createdAt: {
        type: 'datetime',
        default: () => new Date,
    },
}