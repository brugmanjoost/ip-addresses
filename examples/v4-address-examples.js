let IPAddresses = require('../index.js');

// Create an IPv4 address
let ip1 = IPAddresses.v4.address('192.168.1.1');
let ip2 = IPAddresses.v4.address([192, 168, 1, 1]);
let ip3 = IPAddresses.v4.address(ip1); // creates a duplicate

// Get the value for an addres
console.log(ip1.value);                 // yields 3232235777
console.log(ip1.toString());            // yields 192.168.1.1
console.log(ip1.toString(true));        // yields 192.168.001.001
console.log(ip1.toBin());               // yields 11000000101010000000000100000001
console.log(ip1.toBin(' '));            // yields 11000000 10101000 00000001 00000001
console.log(ip1.toBin('.'));            // yields 11000000.10101000.00000001.00000001
console.log(ip1.toArray());             // yields [192,168,1,1]

console.log(IPAddresses.v4.address('10.0.0.0').class);       // yields A
console.log(IPAddresses.v4.address('128.0.0.0').class);      // yields B
console.log(IPAddresses.v4.address('192.0.0.0').class);      // yields C
console.log(IPAddresses.v4.address('224.0.0.0').class);      // yields D
console.log(IPAddresses.v4.address('240.0.0.0').class);      // yields E

console.log(IPAddresses.v4.address('10.0.0.0').private);     // yields true
console.log(IPAddresses.v4.address('11.0.0.0').private);     // yields false
console.log(IPAddresses.v4.address('192.168.0.0').private);  // yields true
console.log(IPAddresses.v4.address('172.25.0.0').private);   // yields true
console.log(IPAddresses.v4.address('172.32.0.0').private);   // yields false
