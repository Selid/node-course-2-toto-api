const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} =  require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
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
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => res.status(400).send(err));
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send("No todo with this id");
        }
        res.send({todo});
    }).catch((err) => {
        res.status(500).send("An error occured");
    })
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

