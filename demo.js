let bcrypt = require('bcryptjs');
let salt = bcrypt.genSaltSync(10);
let hash = bcrypt.hashSync("Sanket@123", salt);
console.log(hash);
// Store hash in your password DB.

// Load hash from your password DB.
console.log(bcrypt.compareSync("Sanket@223", hash)); // true
console.log(bcrypt.compareSync("not_bacon", hash)); // false  