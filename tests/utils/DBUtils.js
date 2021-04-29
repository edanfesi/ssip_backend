const DBUtils = module.exports;

const { db } = require('../../app/utils/Database');

DBUtils.clear = async () => {
  await db.table('user').del();
  await db.table('role').del();
};
