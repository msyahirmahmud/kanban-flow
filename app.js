/**
 * KanbanFlow - Task Board Core Logic
 */

class KanbanBoard {
  constructor(initialData = null) {
    this.columns = {
      todo: [],
      inProgress: [],
      done: []
    };

    if (initialData) {
      this.columns = { ...this.columns, ...initialData };
    } else {
      this.seedDefaults();
    }
  }

  seedDefaults() {
    this.columns = {
      todo: [
        { id: "task-1", title: "Design Landing Page Mockup", priority: "high", tags: ["UI/UX"] },
        { id: "task-2", title: "Set up CI/CD Pipeline", priority: "medium", tags: ["DevOps"] }
      ],
      inProgress: [
        { id: "task-3", title: "Implement Auth Middleware", priority: "high", tags: ["Backend"] }
      ],
      done: [
        { id: "task-4", title: "Project Initialization", priority: "low", tags: ["Setup"] }
      ]
    };
  }

  addTask(column, task) {
    if (!this.columns[column]) throw new Error(`Invalid column: ${column}`);
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: task.title,
      priority: task.priority || "medium",
      tags: task.tags || []
    };
    this.columns[column].push(newTask);
    return newTask;
  }

  moveTask(taskId, targetColumn) {
    if (!this.columns[targetColumn]) return false;
    let foundTask = null;

    for (const colKey of Object.keys(this.columns)) {
      const idx = this.columns[colKey].findIndex(t => t.id === taskId);
      if (idx !== -1) {
        [foundTask] = this.columns[colKey].splice(idx, 1);
        break;
      }
    }

    if (foundTask) {
      this.columns[targetColumn].push(foundTask);
      return true;
    }
    return false;
  }

  deleteTask(taskId) {
    for (const colKey of Object.keys(this.columns)) {
      const idx = this.columns[colKey].findIndex(t => t.id === taskId);
      if (idx !== -1) {
        this.columns[colKey].splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  filterTasksByPriority(priority) {
    if (!priority || priority === "all") return this.columns;
    const filtered = {};
    for (const [col, tasks] of Object.entries(this.columns)) {
      filtered[col] = tasks.filter(t => t.priority === priority);
    }
    return filtered;
  }

  exportBoardState() {
    return JSON.stringify(this.columns, null, 2);
  }

  importBoardState(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data && data.todo && data.inProgress && data.done) {
        this.columns = data;
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = KanbanBoard;
}
