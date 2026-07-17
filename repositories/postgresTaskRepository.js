const { Pool } = require('pg');
const TaskRepository = require('./taskRepository');

class PostgresTaskRepository extends TaskRepository {
  constructor(connectionString) {
    super();
    this.pool = new Pool({ connectionString });
  }

  async list() {
    const result = await this.pool.query('SELECT id, title, done FROM tasks ORDER BY id');
    return result.rows;
  }

  async getById(id) {
    const result = await this.pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async create(task) {
    const result = await this.pool.query(
      'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING id, title, done',
      [task.title, task.done]
    );
    return result.rows[0];
  }

  async update(id, updates) {
    const fields = [];
    const values = [];

    if (updates.title !== undefined) {
      fields.push(`title = $${fields.length + 1}`);
      values.push(updates.title);
    }

    if (updates.done !== undefined) {
      fields.push(`done = $${fields.length + 1}`);
      values.push(updates.done);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const result = await this.pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING id, title, done`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await this.pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  }
}

module.exports = PostgresTaskRepository;
