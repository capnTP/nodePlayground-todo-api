require('../server/config/config');

let localOffset = process.env.TIMEOFFSET ||
  -new Date().getTimezoneOffset()*60000;
let localTime = new Date().getTime();
let local = localTime + parseInt(localOffset);
let offset = 2;
let japan = local + (3600000*offset);

console.log('Local Time', localTime);
console.log('Local Offset', localOffset);
console.log('BKK', new Date(local).toLocaleString());
console.log('Japan', new Date(japan).toLocaleString());
