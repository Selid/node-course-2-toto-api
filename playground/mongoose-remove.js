const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result.result);
// });

// Todo.findOneAndRemove({

// }).then((res) => {
//     console.log(res);
// });

Todo.findByIdAndRemove("5c335ed2093e5548102554c7").then((res) => {
    console.log(res);
    
})