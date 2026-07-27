const assert = require('assert');
const fs = require('fs');
const path = require('path');
const SqliteTaskRepository = require('../repositories/sqliteTaskRepository');

(async () => {
  const dbPath = path.join(__dirname, '..', 'tasks.test.db');

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const repo1 = new SqliteTaskRepository(dbPath);
  const created = await repo1.create({ title: 'Write tests', done: false });

  assert.strictEqual(created.title, 'Write tests');
  assert.strictEqual(created.done, false);

  const listed = await repo1.list();
  assert.strictEqual(listed.length, 4);

  const repo2 = new SqliteTaskRepository(dbPath);
  const persisted = await repo2.list();
  assert.strictEqual(persisted.length, 4);
  assert.strictEqual(persisted[persisted.length - 1].title, 'Write tests');

  console.log('repository tests passed');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
