// const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');

let objectId = new ObjectID();

console.log(objectId);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB Server');

    /*     db.collection('Todo').insertOne({
            text: 'Something to do',
            completed: false
        }, (err, result) => {
            if (err) {
                return console.log('Unable to insert todo', err);
            }

            console.log(JSON.stringify(result.ops, undefined, 2));
        }); */

    db.collection('User').insertOne({
        name: 'fieldyn',
        age: 34,
        location: 'Los Teques',
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err);
        }
        console.log(result.ops[0]._id.getTimestamp());
    });
    db.close();
});