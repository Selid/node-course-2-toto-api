const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect( 'mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.error("Unable to connect to MongoDB server")
    }
    console.log("Connected to MongoDB server");
    const db = client.db('TodoApp');

    //deleteMany
    // db.collection('Todos').deleteMany({text:"Eat lunch"}).then((result) => {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // })

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({text: 'Eat lunch'}). then((result) => {
    //     console.log("Deleted : ");
    //     console.log(JSON.stringify(result, undefined, 2));
    // });

    db.collection("Users").deleteMany({text: "Eat lunch"}).then((result) => {
        console.log(result);
    });

    db.collection("Users").findOneAndDelete({age: 28}).then((result) => {
        console.log(result);
        
    })

    //client.close();
});