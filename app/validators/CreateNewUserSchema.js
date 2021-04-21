const CreateNewUserSchema = {
    type: "object",
    properties: {
        name: { type: 'string' },
        last_name: { type: 'string' },
        country: { type: 'string' },
        department: { type: 'string' },
        work_position: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        role_id: { type: 'integer' }
    },
    required: ["name", "last_name", "country", "department", "work_position", "username", "password"],
    additionalProperties: false
}

module.exports = CreateNewUserSchema;