//const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');
  const users = db.collection('Users');
  // db.collection('Todos').find({
  //   _id: new ObjectID('5a81405288833c2694777b73')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, null, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });
  let name = 'Dummy';
  users.find({name}).count().then((count) => {
    console.log(`User(s) count:${count}`);
    return users.find({name}).toArray();
  }).then((docs) => {
    console.log(JSON.stringify(docs, null, 2));
  }).catch((err) => {
    console.log('Unable to fetch the result', err);
  });

  // client.close();
  // console.log('Connection ended...');
});
