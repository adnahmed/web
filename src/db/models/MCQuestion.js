/**
 * MCQuestion Definition
 */
 module.exports = {
    id: {
        primary: true,
        type: 'uuid',
        required: true, // Exists constraint in Enterprise mode.
        optional: false,
    },
    question: {
        primary: true,
        type: 'string',
        required: true, 
        optional: false,
    },
    createdAt: {
        type: 'datetime',
        default: () => new Date,
    },
}