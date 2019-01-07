const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

var {app} = require('../server');
var {Todo} = require('../models/todo');

const todos = [{
    _id: new ObjectId(),
    text:"First test to do"
},{
    _id: new ObjectId(),
    text:"Second test to do"
}];

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

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