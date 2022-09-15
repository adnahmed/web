/**
 * MCQChoice Definition
 */
 module.exports = {
    id: {
        primary: true,
        type: 'uuid',
        required: true, // Exists constraint in Enterprise mode.
        optional: false,
    },
    statement: {
        primary: true,
        type: 'string',
        required: true, 
        optional: false,
    },
    belongs_to: {
        type: 'relationship',
        relationship: 'BELONGS_TO',
        direction: 'out',
        target: 'MCQuestion'
    },
    createdAt: {
        type: 'datetime',
        default: () => new Date,
    },
}