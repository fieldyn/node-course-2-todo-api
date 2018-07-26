// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

let objectId = new ObjectID();

console.log(objectId);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB Server');

    /*     let cosa = db.collection('Todo').find({
            completed: false
        }).toArray().then((res) => {
            console.log(JSON.stringify(res, undefined, 2));
        }, (err) => {
            console.log('Unable to fetch Todos', err);
        });
     */
    /*     let cosa = db.collection('Todo').find().count().then((res) => {
                console.log(`TODOS count ${res}`);
            },
            (err) => {
                console.log('Unable to fetch Todos', err);
            }); */

    db.collection('User').find({
        name: 'fieldyn'
    }).toArray().then((result) => {
        console.log('Users:');
        console.log(JSON.stringify(result, undefined, 2));
    }).catch((err) => {
        console.log('Unable to fetch user', err);
    });

    db.close();
});