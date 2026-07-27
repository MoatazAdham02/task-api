const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const TaskRepository = require('./taskRepository');

class SqliteTaskRepository extends TaskRepository {
  constructor(dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'tasks.db')) {
    super();
    this.db = new DatabaseSync(dbPath);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT 0
      )
    `);

    const row = this.db.prepare('SELECT COUNT(*) AS count FROM tasks').get();
    if (row.count === 0) {
      this.db.exec(`
        INSERT INTO tasks (title, done) VALUES
          ('Buy milk', 0),
          ('Write report', 0),
          ('Call mom', 0)
      `);
    }
  }

  normalizeTask(task) {
    return task ? { ...task, done: Boolean(task.done) } : null;
  }

  toSqliteDone(value) {
    return value ? 1 : 0;
  }

  list() {
    const rows = this.db.prepare('SELECT id, title, done FROM tasks ORDER BY id').all();
    return rows.map((row) => this.normalizeTask(row));
  }

  getById(id) {
    return this.normalizeTask(this.db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(id) || null);
  }

  create(task) {
    const result = this.db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)').run(task.title, this.toSqliteDone(task.done));
    return this.getById(result.lastInsertRowid);
  }

  update(id, updates) {
    const fields = [];
    const values = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }

    if (updates.done !== undefined) {
      fields.push('done = ?');
      values.push(this.toSqliteDone(updates.done));
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    this.db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.getById(id);
  }

  delete(id) {
    const result = this.db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

module.exports = SqliteTaskRepository;
