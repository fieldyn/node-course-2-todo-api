const { ObjectId } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// });


Todo.findOneAndRemove({ _id: '5b5932797ecf7232ef0d6446' }).then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});


Todo.findByIdAndRemove('5b5932757ecf7232ef0d6445').then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});