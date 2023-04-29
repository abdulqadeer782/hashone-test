const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    child: []
}, { timestamps: true })

module.exports = User = mongoose.model('Todo', TodoSchema)
