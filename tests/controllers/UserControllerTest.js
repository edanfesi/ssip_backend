const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sandbox = require('sinon').createSandbox();

const app = require('../../index');
const DBUtils = require('../utils/DBUtils');

chai.use(chaiHttp);

const BASE_USER_URL = '/api/ssip/user';

describe('User Controller', () => {
    beforeEach(async () => {
        DBUtils.clear();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should get create a new user', async () => {
        const userData = {
            name: "Edward",
            last_name: "Fernandez",
            country: "CO",
            department: "Engineering",
            work_position: "Software Engineer",
            username: "edward.fernandez",
            password: "1234"
        }

        const { status, body } = await chai.
            request(app)
            .post(`${BASE_USER_URL}/new`)
            .set('content-type', 'application/json')
            .send({ test: "test" });

        assert.strictEqual(status, 201);
        assert.strictEqual(body.name, userData.name)
        assert.strictEqual(body.last_name, userData.last_name)
        assert.strictEqual(body.country, userData.country)
        assert.strictEqual(body.department, userData.department)
        assert.strictEqual(body.work_position, userData.work_position)
        assert.strictEqual(body.username, userData.username)
    });
});