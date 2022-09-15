/**
 * Exam Definition
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
    start: {
        required: true,
        optional: false,
        type: 'datetime'
    },
    end: {
        required: true,
        optional: false,
        type: 'datetime'
    },
    belongs_to: {
        type: 'relationship',
        relationship: 'BELONGS_TO',
        direction: 'out',
        target: 'Subject',
    },
    createdAt: {
        type: 'datetime',
        default: () => new Date,
    },
}