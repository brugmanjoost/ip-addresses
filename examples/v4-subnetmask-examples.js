let IPAddresses = require('../index.js');

// Create an IPv4 subnet mask
let sm1 = IPAddresses.v4.subnetmask('255.255.255.0');
let sm2 = IPAddresses.v4.subnetmask([255, 255, 255, 0]);
let sm3 = IPAddresses.v4.subnetmask(24);
let sm4 = IPAddresses.v4.subnetmask(sm1); // creates a duplicate

// Get the value for an addres
console.log(sm1.value);          // yields 4294967040
console.log(sm1.toString());     // yields 255.255.255.0
console.log(sm1.toString(true)); // yields 255.255.255.000
console.log(sm1.toBin());        // yields 11111111111111111111111100000000
console.log(sm1.toBin(' '));     // yields 11111111 11111111 11111111 00000000
console.log(sm1.toBin('.'));     // yields 11111111.11111111.11111111.00000000
console.log(sm1.toArray());      // yields [255,255,255,0]
console.log(sm1.length);         // yields 24
