const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect( 'mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.error("Unable to connect to MongoDB server")
    }
    console.log("Connected to MongoDB server");
    const db = client.db('TodoApp');

    // db.collection('Todos').find({_id: new ObjectID('5c2ccfa6c3dfe84b44399e5d')}).toArray().then((documents) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(documents, undefined, 2));
        
    // }, (err) => {
    //     console.error("Unable to fetch Todos")
    // });

    db.collection('Todos').find().count().then((counter) => {
        console.log('Todos');
        console.log(`There is ${counter} todo(s) matching this search`);
        
    }, (err) => {
        console.error("Unable to fetch Todos")
    });

    db.collection('Users').find({name: "Celid", age:29}).toArray().then((users) => {
        console.log(JSON.stringify(users, undefined, 2));
    }, (err) => console.error(err));

    //client.close();
});