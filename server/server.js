const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    console.log("Getting todos");
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => res.status(400).send(err));
});

app.listen(3000, () => {
    console.log("Starrted on port 3000");
});

module.exports = {
    app
}





// var otherTodo = new Todo({
//     text:'Learn Node',
//     completed: false,
//     completedAt: 0
// });

// otherTodo.save().then((doc) => {
//     console.log("Saved :", doc);
    
// }, (e) => console.log("Unable to save"));




// var newUser = new User({
//     email: "moi@myself.com"
// });

// newUser.save().then((user) => {
//     console.log(user);
// }, (e) => console.error(e));

