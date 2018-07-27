const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { ObjectId } = require('mongodb');

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then((result) => {
        res.send(result);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((result) => {
        res.send({
            todos: result
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((result) => {
        if (!result) {
            return res.status(404).send();
        }
        res.send({
            todo: result
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((result) => {
        if (!result) {
            return res.status(404).send();
        }
        res.send({
            todo: result
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};