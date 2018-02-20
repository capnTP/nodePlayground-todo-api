const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

let id = '5a840087dc05210c0ceeade9';
let userID = '5a82b10c87bd65199000fe08';

// Todo.remove({}).then((res) => {
//   console.log(res);
// });

Todo.findOneAndRemove({_id: '5a8a8411877974245000ada8'}).then((todo) => {
  console.log(todo);
})

// Todo.findByIdAndRemove('5a8a8411877974245000ada8').then((todo) => {
//   console.log(todo);
// }, (e) => {
//   console.log('id not found');
// })
