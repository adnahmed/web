/**
 * MCQExam Definition
 */
 module.exports = {
    id: {
        primary: true,
        type: 'uuid',
        required: true, // Exists constraint in Enterprise mode.
        optional: false,
    },
    belongs_to: {
        type: 'relationship',
        relationship: 'BELONGS_TO',
        direction: 'out',
        target: 'Exam',
    },
    contains: {
        type: 'relationship',
        relationship: 'CONTAINS',
        direction: 'out',
        target: 'MCQuestion'
    },
    createdAt: {
        type: 'datetime',
        default: () => new Date,
    },
}