const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = 'abcdef';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   })
// });

let hashedPassword = '$2a$10$Z2VIvuaKWpxXDXNEk2q9mOtAkl1EoyxMYNl940r8mG7xtAQSJaw5u';

bcrypt.compare(password, hashedPassword).then((res) => console.log(res));
// let data = {
//   id: 9
// }
//
// let token = jwt.sign(data, '9989xyz');
// console.log(token.toString());
//
// let decoded = jwt.verify(token, '9989xyz');
// console.log('decoded =', decoded);
// let message = 'user no5';
// let hash = SHA256(message + 'secretkey').toString();
//
// console.log('message =', message);
// console.log('hash =', hash);
//
// let data = {
//   id: 3
// }
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'secretkey').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'secretkey').toString();
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Reject');
// }
