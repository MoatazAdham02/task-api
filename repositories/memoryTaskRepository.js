const TaskRepository = require('./taskRepository');

class MemoryTaskRepository extends TaskRepository {
  constructor(initialTasks = []) {
    super();
    this.tasks = initialTasks.map((task) => ({ ...task }));
  }

  async list() {
    return this.tasks.map((task) => ({ ...task }));
  }

  async getById(id) {
    const task = this.tasks.find((item) => item.id === id);
    return task ? { ...task } : null;
  }

  async create(task) {
    this.tasks.push({ ...task });
    return { ...task };
  }

  async update(id, updates) {
    const index = this.tasks.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    this.tasks[index] = { ...this.tasks[index], ...updates };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    const index = this.tasks.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    this.tasks.splice(index, 1);
    return true;
  }
}

module.exports = MemoryTaskRepository;
