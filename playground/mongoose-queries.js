const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('../server/models/user');

var id = '5c33518fd881d32c58fa2a87';
var userId = '5c2f6ed9eb0ced25f025c1df'

if (!ObjectID.isValid(id)) {
    console.log("Id not valid");
    
}

// Todo.find({
//     _id :id
// }).then((todos) => console.log('Todos', todos));

// Todo.findOne({
//     completed: false
// }).then((todo) => console.log('Todo', todo));

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log("No Todo found");
//     }
//     console.log('Todo by Id', todo);
// }).catch((e) => console.log(e));

User.findById(userId).then((user) => {
    if (!user) {
        return console.log("User not found");
    }
    console.log(user);
}).catch((err) => console.log(err));