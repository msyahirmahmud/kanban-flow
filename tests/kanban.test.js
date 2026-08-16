const assert = require('assert');
const { test, describe } = require('node:test');
const KanbanBoard = require('../app.js');

describe('KanbanFlow Unit Tests', () => {
  test('initializes with seed data correctly', () => {
    const board = new KanbanBoard();
    assert.strictEqual(board.columns.todo.length, 2);
    assert.strictEqual(board.columns.inProgress.length, 1);
    assert.strictEqual(board.columns.done.length, 1);
  });

  test('searchTasks filters tasks by title or tag', () => {
    const board = new KanbanBoard();
    const found = board.searchTasks('Auth');
    assert.strictEqual(found.inProgress.length, 1);
    assert.strictEqual(found.inProgress[0].title.includes('Auth'), true);
  });

  test('addTask appends new task to target column', () => {
    const board = new KanbanBoard();
    const task = board.addTask('todo', { title: 'Write unit tests', priority: 'high' });
    assert.strictEqual(board.columns.todo.length, 3);
    assert.strictEqual(task.title, 'Write unit tests');
  });

  test('moveTask shifts task between columns', () => {
    const board = new KanbanBoard();
    const success = board.moveTask('task-1', 'inProgress');
    assert.strictEqual(success, true);
    assert.strictEqual(board.columns.todo.length, 1);
    assert.strictEqual(board.columns.inProgress.length, 2);
  });

  test('deleteTask removes task from board', () => {
    const board = new KanbanBoard();
    const deleted = board.deleteTask('task-3');
    assert.strictEqual(deleted, true);
    assert.strictEqual(board.columns.inProgress.length, 0);
  });

  test('filterTasksByPriority filters task list accurately', () => {
    const board = new KanbanBoard();
    const highTasks = board.filterTasksByPriority('high');
    assert.strictEqual(highTasks.todo.length, 1);
    assert.strictEqual(highTasks.inProgress.length, 1);
  });
});
