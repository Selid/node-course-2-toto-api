// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = {
//     name:'Celid',
//     age: 28
// };
// var {name} = user;
// console.log(name);

MongoClient.connect( 'mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.error("Unable to connect to MongoDB server")
    }
    console.log("Connected to MongoDB server");
    const db = client.db('TodoApp');


    // db.collection('Todos').insertOne({
    //     text: 'Someting to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.error('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: "Celid",
    //     age: 28,
    //     location:"Here"
    // }, (err, result) => {
    //     if (err) {
    //         return console.log("Unable to write the user", err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    client.close();
});