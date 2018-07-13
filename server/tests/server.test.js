const expect = require('expect');
const request = require('supertest');

const {
    app
} = require('../server');

const {
    Todo
} = require('../models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => done());
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

                Todo.find().then((result) => {
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
                    expect(result.length).toBe(0);
                }).catch((err) => done(err));

                done();
            });
    });

});