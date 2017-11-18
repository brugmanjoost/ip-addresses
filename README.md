# ip-addresses
A javascript module to facilitate working with IP addresses

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)<br />
4. [API](#api)<br />
4.1 [Class: IPv4Address](#class-IPv4Address)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.1.1 [Property: value](#class-IPv4Address-value)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.1.2 [Method: toString](#class-IPv4Address-toString)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.1.3 [Method: toBin](#class-IPv4Address-toBin)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.1.4 [Method: toArray](#class-IPv4Address-toArray)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.1.4 [Method: mask](#class-IPv4Address-mask)<br />
4.2 [Class: IPv4Subnetmask](#class-IPv4Subnetmask)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.1 [Property: value](#class-IPv4Subnetmask-value)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.2 [Method: toString](#class-IPv4Subnetmask-toString)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.3 [Method: toBin](#class-IPv4Subnetmask-toBin)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.4 [Method: toArray](#class-IPv4Subnetmask-toArray)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.2.4 [Method: invert](#class-IPv4Subnetmask-invert)<br />
4.3 [Class: IPv4Range](#class-IPv4Range)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.1 [Property: firstAddress](#class-IPv4Range-firstAddress)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.1 [Property: lastAddress](#class-IPv4Range-lastAddress)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.1 [Property: length](#class-IPv4Range-length)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.4 [Method: contains](#class-IPv4Range-contains)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.3.4 [Method: getIterator](#class-IPv4Range-getIterator)<br />
4.4 [Class: IPv4Subnet](#class-IPv4Subnet)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.4.1 [Property: subnetMask](#class-IPv4Subnet-subnetMask)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.4.1 [Property: networkAddress](#class-IPv4Subnet-networkAddress)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.4.1 [Property: broadcastAddress](#class-IPv4Subnet-broadcastAddress)<br />
&nbsp;&nbsp;&nbsp;&nbsp;4.4.1 [Property: numberOfHosts](#class-IPv4Subnet-numberOfHosts)<br />

## Introduction
This module intends to facilitate working with IP addresses, currently v4 only.

## Installation
```sh
$ npm install ip-addresses
```

## Usage

### IPv4 Addresses
Following are examples using an individual address:

```javascript
let IPAdresses = require('ip-addresses');

// Create an IPv4 address
let ip1 = IPAddresses.v4.address('192.168.1.1');
let ip2 = IPAddresses.v4.address([192, 168, 1, 1]);
let ip3 = IPAddresses.v4.fromAny(ip1); // creates a duplicate

// Get the value for an address
console.log(ip1.address());      // yields 3232235777
console.log(ip1.toString());     // yields 192.168.1.1
console.log(ip1.toString(true)); // yields 192.168.001.001
console.log(ip1.toBin());        // yields 11000000101010000000000100000001
console.log(ip1.toBin(' '));     // yields 11000000 10101000 00000001 00000001
console.log(ip1.toBin('.'));     // yields 11000000.10101000.00000001.00000001
console.log(ip1.toArray());      // yields [ 192, 168, 1, 1 ]

```

## API

### Class: IPv4Address
This class represents an IPv4 address, typically defined by a single 32bit unsigned integer.

#### Property: value
Readonly. Returns the 32bit unsigned integer that representst the address.

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
Readonly. Returns the 32bit unsigned integer that representst the mask.

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
let IPAdresses = require('ip-addresses');

let range = IPAddresses.v4.range('192.168.1.1-192.168.1.254');
let iterator = range.getIterator();
while(!(let item = iterator.next()).done)
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

#### Property: numberOfHosts
Readonly. The number of hosts present in the subnet. This is always equal to length - 2.

#### Method: getHostsIterator()
Similar to getIterator() except that this specific iterator skips the networkAddress and broadcastAddress to as only to iterate hosts.

