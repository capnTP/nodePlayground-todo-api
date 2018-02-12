//const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //const db = client.db('TodoApp');
  // client.db('TodoApp').collection('Todos').insertOne({
  //   text: 'something',
  //   completed: false
  // }, (err, res) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(res.ops, null, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Dummy',
  //   age: 30,
  //   location: 'US'
  // }, (err, res) => {
  //   if (err)
  //     return console.log('Unable to insert new user(s)', err);
  //
  //   console.log(JSON.stringify(res.ops[0]._id.getTimestamp(), null, 2));
  // });

  client.close();
  console.log('Connection ended...');
});
