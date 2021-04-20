const DBUtils = module.exports;

const { db } = require('../../src/utils/Database');

DBUtils.clear = async () => {
    await db.table('user').del();
    await db.table('role').del();
}