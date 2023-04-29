const Todo = require("../models/todoModel")

// get all records 
const getTodos = async (req, res) => {
    try {
        let result = await Todo.find();
        if (result) res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            body: error,
        })
    }
}

// add Category
const addCategory = async (req, res) => {
    try {
        if (req.body) {

            let newCategory = new Todo({
                category: req.body.category,
                child: []
            })

            let result = await newCategory.save()
            if (result) res.status(200).json("Category has been added.")
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            body: error,
        })
    }
}


// add todo
const addTodo = async (req, res) => {
    try {
        if (req.body) {
            const { id, todo } = req.body;
            const existTodo = await Todo.findOne({ _id: id })
            existTodo.child.push({ todo: todo, child: [] })
            const updated = await existTodo.save();
            if (updated) res.status(200).json("Todo has been added.")
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            body: error,
        })
    }
}

// add todo
const updateTodo = async (req, res) => {
    try {
        if (req.body) {
            const { id, index, todo } = req.body;
            const updateTodo = await Todo.findOne({ _id: id })
            let child = updateTodo.child;
            child[index] = { ...child[index], todo: todo };

            const updated = await updateTodo.save();
            if (updated) res.status(200).json("Todo has been updated.")
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            body: error,
        })
    }
}

// delete todo 
const deleteTodo = async (req, res) => {
    try {
        if (req.body) {
            const { id, deleteIndex } = req.body;
            const deleteTodos = await Todo.findOne({ _id: id })
            let { child } = deleteTodos

            deleteTodos.child = child.filter((todo, index) => index !== deleteIndex)
            let afterDeleted = deleteTodos.save()
            if (afterDeleted) res.status(200).json("Todo has been deleted.")
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            body: error,
        })
    }
}

// delete all 
const deleteAll = async (req, res) => {
    try {
        if (req.body) {
            const deleted = await Todo.deleteMany({})
            if (deleted) res.status(200).json("All records has been deleted.")
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            body: error,
        })
    }
}

module.exports = {
    getTodos,
    addCategory,
    addTodo,
    updateTodo,
    deleteTodo,
    deleteAll
}