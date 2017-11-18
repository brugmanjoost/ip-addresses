# ip-addresses
A javascript module to facilitate working with IP addresses

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)<br />
4. [API](#api)<br />
4.1 [Class: IPv4Address](#class-ipv4address)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.1.1 [Property: value](#property-value)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.1.2 [Method: toString](#method-tostringuse3digits)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.1.3 [Method: toBin](#method-tobinseparator)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.1.4 [Method: toArray](#method-toarray)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.1.5 [Method: mask](#method-masksubnetmask)<br />
4.2 [Class: IPv4Subnetmask](#class-ipv4subnetmask)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.1 [Property: value](#property-value-1)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.2 [Property: length](#property-length)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.3 [Method: toString](#method-tostringuse3digits-1)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.4 [Method: toBin](#method-tobinseparator-1)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.5 [Method: toArray](#method-toarray-1)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.6 [Method: invert](#method-invert)<br />
4.3 [Class: IPv4Range](#class-ipv4range)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.1 [Property: firstAddress](#property-firstaddress)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.2 [Property: lastAddress](#property-lastaddress)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.3 [Property: length](#property-length-1)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.4 [Method: contains](#method-contains)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.5 [Method: getIterator](#method-getiterator)<br />
4.4 [Class: IPv4Subnet](#class-ipv4subnet)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.4.1 [Property: subnetMask](#property-subnetmask)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.4.2 [Property: networkAddress](#property-networkaddress)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.4.3 [Property: broadcastAddress](#property-broadcastaddress)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.4.4 [Property: hosts](#property-hosts)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.5 [Method: getHostsIterator](#method-gethostsiterator)<br />

## Introduction
This module intends to facilitate working with IP addresses, currently v4 only.

## Installation
```sh
$ npm install ip-addresses
```

## Usage

### IPv4 Addresses

```javascript
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

try {
    let ip0 = IPAddresses.v4.address('192.168.1');
}
catch(e) {
    console.log(e.constructor.name);    // yields IPv4AddressError
}
```

### IPv4 Subnet masks

```javascript
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

try {
    let sm0 = IPAddresses.v4.subnetmask('255.255.255.1');
}
catch(e) {
    console.log(e.constructor.name);    // yields IPv4SubnetmaskError
}
```

### IPv4 Ranges

```javascript
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

try {
    let sm0 = IPAddresses.v4.range('192.168.1.0-192.168.1.2.3');
}
catch(e) {
    console.log(e.constructor.name);    // yields IPv4RangeError
}
```

### IPv4 Subnets

```javascript
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

try {
    let ip0 = IPAddresses.v4.subnet('192.168.1.1/65');
}
catch(e) {
    console.log(e.constructor.name);    // yields IPv4SubnetError
}
```

## API

### Class: IPv4Address
This class represents an IPv4 address, typically defined by a single 32bit unsigned integer.

#### Property: value
Readonly. The 32bit unsigned integer that representst the address.

#### Method: toString(use3Digits)
Returns the address in octet format, e.g. 192.168.1.1. If use3Digits is true toString() returns all octets left padded with zeros, e.g. 192.168.001.001.

#### Method: toBin(separator)
Returns the address in binary format, e.g. 11000000101010000000000100000001. If separator is set then its first character is used as a separator between the octets, e.g. 11000000 10101000 00000001 00000001 for a space character or 11000000.10101000.00000001.00000001 for a dot.

#### Method: toArray()
Returns the address as an array, e.g. [ 192, 168, 1, 1 ].

#### Method: mask(subnetmask)
Returns a new IPv4Address object with its address set to that of the original address masked against the given subnet mask, e.g. 192.168.0.0 for a subnet mask 255.255.0.0. The subnetmask may be specified as an IPv4Subnetmask, a string e.g. 255.255.0.0 or an integer specifying the number of bits occupied by the mask.

### Class: IPv4Subnetmask
This class represents an IPv4 subnet mask, typically defined by a single 32bit unsigned integer.

#### Property: value
Readonly. The 32bit unsigned integer that representst the mask.

#### Property: length
Readonly. The length of the subnet mask (the number of 1's in the binary representation).

#### Method: toString(use3Digits)
Returns the mask in octet format, e.g. 255.255.255.0. If use3Digits is true toString() returns all octets left padded with zeros, e.g. 255.255.255.000.

#### Method: toBin(separator)
Returns the mask in binary format, e.g. 11111111111111111111111100000000. If separator is set then its first character is used as a separator between the octets, e.g. 11111111 11111111 11111111 00000000 for a space character or 11111111.11111111.11111111.00000000 for a dot.

#### Method: toArray()
Returns the mask as an array, e.g. [ 192, 168, 1, 1 ].

#### Method: invert()
Returns a new Subnet mask with its mask set to be the inversion of the original mask.

### Class: IPv4Range
This class represents a range typically used for iteration. It is also the base class for IPv4Subnetmask.

#### Property: firstAddress
Readonly. An IPv4Address representing the first address in the range.

#### Property: lastAddress
Readonly. An IPv4Address representing the last address in the range.

#### Property: length
Readonly. The number of addresses that exist in the range.

#### Method: contains(ip)
Returns true if the given ip address is inside the range. false otherwise. The ip address can be specified as an IPv4Address, a string or an array.

#### Method: getIterator()
Returns an ES6 Generator object to iterate over all addresses in the range. Used like so to list all hosts in the 192.168.1.0 subnet:

```javascript
let iterator = range1.getIterator();
let item;
while(!(item = iterator.next()).done)
    console.log(item.value.toString());
```

### Class: IPv4Subnet
This is an extention of IPv4Range with specific data to represent a subnet. All properties and methods() available 

#### Property: subnetMask
Readonly. An IPv4Subnetmask that specifies the mask used for this subnet.

#### Property: networkAddress
Readonly. An IPv4Address that specifies the network address of the subnet. This is identical to firstAddress.

#### Property: broadcastAddress
Readonly. An IPv4Address that specifies the broadcast address of the subnet. This is identical to lastAddress.

#### Property: hosts
Readonly. The number of hosts present in the subnet. This is always equal to length - 2.

#### Method: getHostsIterator()
Similar to getIterator() except that this specific iterator skips the networkAddress and broadcastAddress to as only to iterate hosts.

