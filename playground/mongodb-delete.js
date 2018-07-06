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

    //delete many users
    db.collection('User').deleteMany({
        name: 'fieldyn'
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log('Unable to delete user', err);
    });

    //findoneanddelete user
    db.collection('User').findOneAndDelete({
        _id: new ObjectID('5b3c21be192db415e9d915b9')
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log('Unable to delete user', err);
    });

    db.close();
});