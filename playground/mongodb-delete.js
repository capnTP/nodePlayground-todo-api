//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');
  const todos = db.collection('Todos');
  const users = db.collection('Users');

  //deleteMany
  // todos.deleteMany({text: 'Eat something delicious'}).then((res) => {
  //   console.log(res);
  // }, (err) => {
  //   console.log(err);
  // })
  // users.deleteMany({name: 'Dummy'});

  //deleteOne
  // todos.deleteOne({text: 'Eat something delicious'}).then((res) => {
  //   console.log(res);
  // });

  //findOneAndDelete
  users.findOneAndDelete({_id: new ObjectID('5a81601688833c26947780b9')}).then((res) => {
    console.log(JSON.stringify(res, null, 2));
  })

  // client.close();
  // console.log('Connection ended...');
});
