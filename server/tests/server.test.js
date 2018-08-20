const expect = require('expect');
const request = require('supertest');
const ObjectID = require('mongodb').ObjectID;
const { app } = require('../server');

const { Todo } = require('../models/todo');
const { User } = require('../models/user');

const todos = [{
    _id: new ObjectID,
    text: 'first test todo.'
}, {
    _id: new ObjectID,
    text: 'second test todo.',
    completed: true,
    completedAt: 333
}];

const users = [{
    _id: new ObjectID,
    email: 'fieldyn@gmail.com',
    password: 'asd123!',
    tokens: [{ access: 'asd', token: 'asd' }]
}, {
    _id: new ObjectID,
    email: 'fieldyn2@gmail.com',
    password: 'asd123!',
    tokens: [{ access: 'asd', token: 'asd' }]
}];

beforeEach((done) => {
    Todo.remove({})
      .then(() => {
        return Todo.insertMany(todos);
      })
      .then(() => User.remove({}))
      .then(() => done());

    
});

describe('POST /Todos', () => {
    it('should create a new Todo', (done) => {
        let test = 'testing with supertest';
        request(app)
            .post('/todos')
            .send({
                text: test
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(test)
            })
            .end((err, res) => {
                if (err) return done(err);

                Todo.find({
                    text: test
                }).then((result) => {
                    expect(result.length).toBe(1);
                    expect(result[0].text).toBe(test);
                    done();
                }).catch((err) => done(err));
            })



    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({
                text: ''
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                Todo.find().then((result) => {
                    expect(result.length).toBe(2);
                }).catch((err) => done(err));

                done();
            });
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            }).end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get one doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if not found', (done) => {
        let newId = new ObjectID();
        request(app)
            .get(`/todos/${newId.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for not-object ids', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete a todo', (done) => {
        let hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            }).end((err, res)=>{
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((result) => {
                    expect(result).toNotExist();
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should return 404 if todo not found', (done) => {
        let newId = new ObjectID();
        request(app)
            .delete(`/todos/${newId.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if objectid not valid', (done) => {
        request(app)
            .delete(`/todos/123}`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () =>{
    it('should update the todo', (done)=>{
        let hexId = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text:'patch test', completed: true})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe('patch test');
                expect(res.body.completed).toBe(true);
                expect(res.body.completedAt).toExist();
                expect(res.body.completedAt).toBeA('number');
            }).end(done);
    });

    it('should clear the completedAt when todo is not completed', (done) => {
        let hexId = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text: 'patch test2', completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe('patch test2');
                expect(res.body.completed).toBe(false);
                expect(res.body.completedAt).toNotExist();
            }).end(done);
    });

});

describe('POST /users', () =>{
    it('should add the user', (done)=>{
        let test = {
            email: 'fieldyn@gmail.com',
            password: 'asd123!'//,
            //tokens: [{ access: 'asd', token: 'asd' }]
        };

        request(app)
            .post(`/users`)
            .send(test)
            .expect(200)
            .expect((res) =>{
                expect(res.body.email).toBe(test.email);
            }).end((err, res)=>{
                if(err) return done(err);

                User.find({email:res.body.email}).then((result)=>{
                    expect(result.length).toBeGreaterThanOrEqualTo(1);
                    expect(result[0].email).toBe(res.body.email);
                    done();
                }).catch((err)=>{
                    return done(err);
                });
                
            });
    });
});