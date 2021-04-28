const UpdateUserSchema = {
    type: "object",
    properties: {
        name: { type: 'string' },
        last_name: { type: 'string' },
        country: { type: 'string' },
        department: { type: 'string' },
        work_position: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
    },
    additionalProperties: false
}

module.exports = UpdateUserSchema;