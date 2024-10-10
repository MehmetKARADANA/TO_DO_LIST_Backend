const express = require('express');
const router = express.Router();
const { protect } = require("./authMiddleware");

// Yolu './todosController' olarak güncelledik
const {getTodos, setTodo, updateTodo, deleteTodo} = require('./todosController');

// Router yapılandırmaları
router.route("/").get(protect, getTodos).post(protect, setTodo);
router.route("/").put(protect, updateTodo).delete(protect, deleteTodo);
//bu body params işini çöz
module.exports = router;
