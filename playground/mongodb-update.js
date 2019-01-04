const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect( 'mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.error("Unable to connect to MongoDB server")
    }
    console.log("Connected to MongoDB server");
    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({text: "Walk the dog"}, {$set: {completed: false}}, {returnOriginal: false})
        .then((document) =>  {
            console.log(JSON.stringify(document, undefined, 2));
        });
    db.collection('Users').findOneAndUpdate({name: "Celid"}, {
        $set:{name: "Tristan"},
        $inc:{age: 1}
    }, {returnOriginal: false}).then((document) => {
        console.log(JSON.stringify(document, undefined, 2));
    });
        
    //client.close();
});