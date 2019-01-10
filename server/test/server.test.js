const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, users, populateUsers, populateTodos} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        var text = 'Test todo text';
        request(app).post('/todos').send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it("should not create todo", (done) => {
        var text = "";
        request(app).post('/todos').send({text})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app).get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it("should get a todo", (done) => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it("should return 404 if no todo is found", (done) => {
        var id = new ObjectId();
        request(app).get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it("should return 400 if no vaid id", (done) => {
        request(app).get(`/todos/123`)
            .expect(400)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it("should delete a todo", (done) => {
        request(app).delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                    expect(todo).toBeNull();
                    done();
                }).catch((e) => done(e));
            });
    });

    it("should send a 404", (done) => {
        var id = new ObjectId().toHexString();
        request(app).delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it("should return a 400", (done) => {
        request(app).delete(`/todos/123`)
            .expect(400)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it("should update a todo", (done) => {
        var id = todos[1]._id.toHexString();
        var updatedTodo = {
            "completed": true,
            "text" : "This is done"
        };
        request(app).patch(`/todos/${id}`).send(updatedTodo)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(updatedTodo.completed);
                expect(res.body.todo.text).toBe(updatedTodo.text);
                expect(res.body.todo.completedAt).toBeDefined();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(id).then((todo) => {
                    expect(todo.completed).toBe(updatedTodo.completed);
                    expect(todo.text).toBe(updatedTodo.text);
                    expect(todo.completedAt).toBeDefined();
                    done();
                });
            });
    });

    it("should clear completedAt when completed become false", (done) => {
        var id = todos[1]._id.toHexString();
        var updatedTodo = {
            "completed": false
        };
        request(app).patch(`/todos/${id}`).send(updatedTodo)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(updatedTodo.completed);
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(id).then((todo) => {
                    expect(todo.completed).toBe(updatedTodo.completed);
                    expect(todo.completedAt).toBeNull();
                    done();
                });
            });
    });

    it("should send a 404", (done) => {
        var id = new ObjectId().toHexString();
        request(app).patch(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it("should return a 400", (done) => {
        request(app).patch(`/todos/123`)
            .expect(400)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it("should return user if authenticated", (done) => {
        request(app).get('/users/me').set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
    });

    it("should return 401 if not authenticated", (done) => {
        request(app).get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
})

describe('POST /users', () => {
    it("should create a user", (done) => {
        var email = "email@me.com"
        var password="123456";

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeDefined();
                expect(res.body._id).toBeDefined();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toBeDefined();
                    expect(user.password).toBeDefined();
                    done();
                }).catch((e) => done(e));
            });
    });

    it("should return errors if invalid request", (done) => {
        var email = "emailatmedotcom"
        var password="   ";

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.header['x-auth']).toBeUndefined();
                expect(res.body).toMatchObject({});
            })
            .end(done);
    });

    it("should not create user for duplicate email", (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[1].email, 
                password: 'Password123!'
            })
            .expect(400)
            .expect((res) => {
                expect(res.text).toBe("Email already exists");
            })
            .end(done);
    });
});

describe('POST /users/login', () => {
    it("should login user and return x-auth token", (done) => {
        request(app).post('/users/login').send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeDefined();

        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toMatchObject({
                    'access':'auth',
                    'token': res.headers['x-auth']
                });
                done();
            }).catch((e) => done(e));
        });
    });

    it("should reject wrong login", (done) => {
        request(app).post('/users/login').send({
            email: users[1].email,
            password: users[1].password + "zrzr"
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeUndefined();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toBeUndefined();
                done();
            }).catch((e) => done(e));
        });
    });
});

describe("DELETE /users/me/token", () => {

    it("should disconnect user", (done) => {
        request(app).delete('/users/me/token').set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if (err){
                return done(err);
            }
            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
        });
    });
    
});