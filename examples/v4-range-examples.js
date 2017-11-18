let IPAddresses = require('../index.js');

// Create an IPv4 range
let range1 = IPAddresses.v4.range('192.168.1.10-192.168.1.19');
let range2 = IPAddresses.v4.range(range1); // creates a duplicate

// Get the value for an addres
console.log(range1.firstAddress.toString());  // yields 192.168.1.10
console.log(range1.lastAddress.toString());   // yields 192.168.1.19
console.log(range1.length);                   // yields 10
console.log(range1.contains('192.168.1.9'));  // yields false
console.log(range1.contains('192.168.1.11')); // yields true

let iterator = range1.getIterator();
let item;
while(!(item = iterator.next()).done)
    console.log(item.value.toString());
// yields 192.168.1.10
// yields 192.168.1.11
// yields 192.168.1.12
// yields 192.168.1.13
// yields 192.168.1.14
// yields 192.168.1.15
// yields 192.168.1.16
// yields 192.168.1.17
// yields 192.168.1.18
// yields 192.168.1.19
