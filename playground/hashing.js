const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, "123abc");
// console.log(token);

// var decoded = jwt.verify(token, "123abc");
// console.log(decoded);

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashed = '$2a$10$AQ9F4CPgAOrWS0PQCiPLju1su6ur0B0QjKASzm.4v22bq49Ei/nMi';

bcrypt.compare(password, hashed, (err, res) => {
    console.log(res);
    
})



// var message = "I am user number 3";

// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// };

// var resultHash = SHA256(JSON.stringify(data) +"somesecret").toString();

// if (resultHash === token.hash) {
//     console.log("Not changed");
// } else {
//     console.log("Changed");
// }