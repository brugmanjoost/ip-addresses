let IPAddresses = require('../index.js');

try {
    let ip0 = IPAddresses.v4.address('192.168.1');
}
catch(e) {
    console.log(e.constructor.name);    // yields IPv4AddressError
}

try {
    let sm0 = IPAddresses.v4.subnetmask('255.255.255.1');
}
catch(e) {
    console.log(e.constructor.name);    // yields IPv4SubnetmaskError
}

try {
    let range0 = IPAddresses.v4.range('192.168.1.0-192.168.1.2.3');
}
catch(e) {
    console.log(e.constructor.name);    // yields IPv4RangeError
}

try {
    let sn0 = IPAddresses.v4.subnet('192.168.1.1/65');
}
catch(e) {
    console.log(e.constructor.name);    // yields IPv4SubnetError
}
