//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');
  // const todos = db.collection('Todos');
  const users = db.collection('Users');

  // todos.findOneAndUpdate({
  //   _id: new ObjectID('5a815c6c88833c2694777fb9')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((res) => {
  //   console.log(res);
  // })

  users.findOneAndUpdate({
    _id: new ObjectID('5a8136ee0439252fb01ca3ae')
  }, {
    $set: { name: 'Dummy' },
    $inc: { age: 1}
  }, {
    returnOriginal: false
  }).then((res) => {
    console.log(JSON.stringify(res, null, 2));
  })

  // client.close();
  // console.log('Connection ended...');
});
