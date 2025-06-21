const { errorHandler } = require("./errorMiddleware");
const asyncHanlder = require('express-async-handler');
const Todo = require('./todoModel');
const User = require("./userModel");

const setTodo = asyncHanlder(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error('Please add text field');
    }
    const todo = await Todo.create({
        text: req.body.text,
        user: req.user.id,
    });
    res.status(200).json(todo);
})

const getTodos = asyncHanlder(async (req, res) => {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json(todos)
});

// Yeni: ID'ye göre tek bir todo döner
const getTodoById = asyncHanlder(async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        res.status(404);
        throw new Error('Todo not found');
    }

    // Kullanıcının sadece kendi todo'sunu görmesi için kontrol
    if (todo.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to view this todo');
    }

    res.status(200).json(todo);
});
/*Asenkron İşlemler: Asenkron fonksiyonlar async anahtar kelimesi ile tanımlanır ve içinde await kullanılarak asenkron işlemler yapılabilir. Örneğin, bir veritabanı sorgusu ya da API isteği yapılabilir.

Hata Yönetimi: Hatalar otomatik olarak express-async-handler modülü tarafından yakalanır. Eğer asenkron kod içinde bir hata oluşursa, bu hata otomatik olarak Express'in hata middleware'ine yönlendirilir.

Kod Okunabilirliği: async/await kullanımı, asenkron kodun daha okunabilir ve anlaşılır olmasını sağlar. */

//korumalı rotalar bunlardan önce authmidlewarei çalışır ve buradaki req id authmiddleware tarafından yerleştirilen req.id //bu sayede user sadece kendi verilerini silebilir
const updateTodo = asyncHanlder(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const todo = await Todo.findById(req.query.id);

       //todo nereden
        // check for user
        if (!user) {
          res.status(401);
          throw new Error("User not found");
        }
      
        // make sure the logged in user matches the todo user
        if (todo.user.toString() !== user.id) {
          res.status(401);
          throw new Error("User not authorized");
        }

        if (!todo) {
            res.status(400);
            throw new Error('Todo not found');
        }

        const updatedTodo = await Todo.findByIdAndUpdate(req.query.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error); // Hata durumunda error middleware'ine geçiş yap
    }
})

const deleteTodo = asyncHanlder(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const todo = await Todo.findById(req.query.id);

        // check for user
        if (!user) {
          res.status(401);
          throw new Error("User not found");
        }
      
        // make sure the logged in user matches the todo user
        if (todo.user.toString() !== user.id) {
          res.status(401);
          throw new Error("User not authorized");
        }

        if (!todo) {
            res.status(400);
            throw new Error('Todo not found');
        }

        await todo.deleteOne();

        res.status(200).json({ id: req.query.id });
    } catch (error) {
        next(error); // Hata durumunda error middleware'ine geçiş yap
    }
})


module.exports = {
    getTodos,
    setTodo,
    getTodoById,
    updateTodo,
    deleteTodo
}
