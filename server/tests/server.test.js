const expect = require('expect');
const request = require('supertest');
const ObjectID = require('mongodb').ObjectID;
const {
    app
} = require('../server');

const {
    Todo
} = require('../models/todo');

const todos = [{
    _id: new ObjectID,
    text: 'first test todo.'
}, {
    _id: new ObjectID,
    text: 'second test todo.'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
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
                expect(res.body.text).toBe(todos[0].text);
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
        let newId = new ObjectID();
        request(app)
            .get(`/todos/123}`)
            .expect(404)
            .end(done);
    });
});