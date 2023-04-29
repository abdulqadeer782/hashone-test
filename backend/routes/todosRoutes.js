const express = require('express');
const { getTodos, addCategory, addTodo, deleteTodo, updateTodo, deleteAll } = require('../controllers/todoController.js');

const router = express.Router();

// routes
router.get('/todos', getTodos);
router.post('/addCategory', addCategory);
router.post('/addTodo', addTodo);
router.post('/updateTodo', updateTodo);
router.post('/deleteTodo', deleteTodo);
router.delete('/deleteAll', deleteAll);

module.exports = router;
