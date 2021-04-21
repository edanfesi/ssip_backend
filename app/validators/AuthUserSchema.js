const AuthUserSchema = {
    type: "object",
    properties: {
        username: { type: 'string' },
        password: { type: 'string' }
    },
    required: ["username", "password"],
    additionalProperties: false
}

module.exports = AuthUserSchema;