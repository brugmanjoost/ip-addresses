let IPAddresses = require('../index.js');

// Create an IPv4 range
let sn1 = IPAddresses.v4.subnet('192.168.1.10/24');
let sn2 = IPAddresses.v4.subnet('192.168.1.10/255.255.255.0');
let sn3 = IPAddresses.v4.range(sn1); // creates a duplicate

// Get the value for an addres
console.log(sn1.firstAddress.toString());      // yields 192.168.1.0
console.log(sn1.networkAddress.toString());    // yields 192.168.1.0
console.log(sn1.lastAddress.toString());       // yields 192.168.1.255
console.log(sn1.broadcastAddress.toString());  // yields 192.168.1.255
console.log(sn1.length);                       // yields 256
console.log(sn1.hosts);                        // yields 254
console.log(sn1.contains('192.168.2.9'));      // yields false
console.log(sn1.contains('192.168.1.11'));     // yields true

let iterator = sn1.getHostsIterator();
let item;
while(!(item = iterator.next()).done)
    console.log(item.value.toString());
// yields 192.168.1.1
// yields 192.168.1.2
// yields 192.168.1.3
// ...
// yields 192.168.1.252
// yields 192.168.1.253
// yields 192.168.1.254
