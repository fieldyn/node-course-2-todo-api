const { ObjectId } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

let id = '5b4d5b368487706632d674e6';
let userId = '5b4eab298d85773d0130114d';



// Todo.find({
//     _id: id
// }).then((result) => {
//     console.log('Todos', result);
// });

// Todo.findOne({
//     _id: id
// }).then((result) => {
//     console.log('Todo', result);
// });

// Todo.findById(id).then((result) => {
//     if (!result) {
//         return console.log('id not found');
//     }
//     console.log('Todo', result);
// }).catch((err) => {
//     console.log(err);
// });

User.findById('5b4eb18ec178bfe74641a332').then((result) => {
    if (!result) {
        return console.log('userId not found', result);
    }
    console.log('User', result);
}).catch((err) => {
    console.log(err);
});