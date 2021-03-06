require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} =  require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator : req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then((todos) => {
        res.send({todos});
    }, (err) => res.status(400).send(err));
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send("No todo with this id");
        }
        res.send({todo});
    }).catch((err) => {
        res.status(500).send("An error occured");
    })
});


app.delete('/todos/:id', authenticate,  (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }
    Todo.findOneAndDelete({
        _id : id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send("No match");
        }
        res.send({todo});
    })
});

app.patch('/todos/:id', authenticate, (req, res) => {    
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }
    var body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    })

});

app.post('/users', (req, res) => {
    var user = new User(_.pick(req.body, ['email', 'password', 'tokens']));
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user)
    }).catch((err) => {
        if (err.code === 11000) {
            res.status(400).send("Email already exists");   
        } else{
            res.status(400).send("Could not create user");
        }
    });
});

app.post('/users/login', (req, res) => {
    var user = new User(_.pick(req.body, ['email', 'password']));
    User.findByCredentials(user.email, user.password).then((userdb) => {
        userdb.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(userdb)
        }).catch((e) => {res.status(400).send(e)});
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (err)=> {
        res.status(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
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

