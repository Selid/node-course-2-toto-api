const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [{
    _id: userOneId,
    email: "me@myself.com",
    password: "userOnePassword",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access:"auth"}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: "I@myself.com",
    password: "userTwoPassword",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access:"auth"}, 'abc123').toString()
    }]
}]

const todos = [{
    _id: new ObjectId(),
    text:"First test to do",
    _creator: users[0]._id
},{
    _id: new ObjectId(),
    text:"Second test to do",
    _creator: users[1]._id
}];

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
}

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
}