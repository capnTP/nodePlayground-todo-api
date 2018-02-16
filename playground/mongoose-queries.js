const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

let id = '5a840087dc05210c0ceeade9';
let userID = '5a82b10c87bd65199000fe08';

//if (!ObjectID.isValid(id)) console.log('ID not valid');

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos\n', todos);
// })
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo\n', todo);
// })

// Todo.findById(id).then((todo) => {
//   if (!todo) return console.log('ID is not found');
//   console.log('Todo by ID\n', todo);
// }).catch((e) => console.log(e));

User.findById(userID).then((user) => {
  if (!user) return console.log('User not found');
  console.log(JSON.stringify(user, null, 2));
}).catch((e) => console.log('Error: ID invalid'));
