/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Module:      ipaddresses.v4
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const factor8 = Math.pow(2, 8);
const factor16 = Math.pow(2, 16);
const factor24 = Math.pow(2, 24);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class: IPv4AddressError
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class IPv4Error extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, IPv4AddressError)
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class: IPv4AddressError
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class IPv4AddressError extends IPv4Error {
    constructor(...args) {
        super('Invalid IPv4 Address specification.');
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class: IPv4SubnetmaskError
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class IPv4SubnetmaskError extends IPv4Error {
    constructor(...args) {
        super('Invalid IPv4 Subnet mask specification.');
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class: IPv4RangeError
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class IPv4RangeError extends IPv4Error {
    constructor(...args) {
        super('Invalid IPv4 Range specification.');
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class: IPv4SubnetError
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class IPv4SubnetError extends IPv4Error {
    constructor(...args) {
        super('Invalid IPv4 Subnet specification.');
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Function:    onlyDigits
//
// Description: Returns true if a string only contains digits. False otherwise.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function onlyDigits(str) {
    return str.match(/^[0-9]+$/) !== null;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Function:    arrayToInt
//
// Description: Converts an array with four elements containing numbers or digit strings into an integer IPv4 address.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function arrayToInt(arrIP, theThingToThrow) {
    let octets = arrIP.map((octet) => {
        if(typeof octet === 'string') {
            octet = octet.trim();
            if(!onlyDigits(octet))
                throw new theThingToThrow();
            octet = parseInt(octet);
        }
        else if(typeof octet === 'number')
            octet = parseInt(octet, 10);
        else
            throw new theThingToThrow();
        if(octet > 255)
            throw new theThingToThrow();
        return octet;        
    });
    return octets[0] * factor24 + octets[1] * factor16 + octets[2] * factor8 + octets[3];
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Function:    stringToInt
//
// Description: Converts a string with an ipv4 address to an integer IPv4 address.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function stringToInt(strIP, theThingToThrow) {
    let octets = strIP.split('.');
    if(octets.length != 4)
        throw new theThingToThrow();
    return arrayToInt(octets, theThingToThrow);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Function:    maskAnd
//
// Description: Performs IPv4Address & IPv4Subnetmask and returns the resulting IPv4Address as an integer.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function maskAnd(ip, mask) {
    /* The following line adjusts the ip address to match the first address in the subnet (filtering all non-subnet mask bits in the ip */
    /* Not that this is done for the left 16 bits and the right 16 bits separately since the bitwise operator works on 32 bit signed integers yielding negative values */
    return ((parseInt(ip.toBin().substr(0,16), 2) & parseInt(mask.toBin().substr(0,16), 2)) * factor16 + (parseInt(ip.toBin().substr(16,16), 2) & parseInt(mask.toBin().substr(16,16), 2)));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Function:    maskOr
//
// Description: Performs IPv4Address | IPv4Subnetmask and returns the resulting IPv4Address as an integer.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function maskOr(ip, mask) {
    /* The following line adjusts the ip address to match the first address in the subnet (filtering all non-subnet mask bits in the ip */
    /* Not that this is done for the left 16 bits and the right 16 bits separately since the bitwise operator works on 32 bit signed integers yielding negative values */
    return ((parseInt(ip.toBin().substr(0,16), 2) | parseInt(mask.toBin().substr(0,16), 2)) * factor16 + (parseInt(ip.toBin().substr(16,16), 2) | parseInt(mask.toBin().substr(16,16), 2)));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Function:    maskInvert
//
// Description: Returns ~IPv4Subnetmask as an integer.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function maskInvert(mask) {
    /* The following line adjusts the ip address to match the first address in the subnet (filtering all non-subnet mask bits in the ip */
    /* Not that this is done for the left 16 bits and the right 16 bits separately since the bitwise operator works on 32 bit signed integers yielding negative values */
    return (((~parseInt(mask.toBin().substr(0,16), 2)) & 0xffff) * factor16 + (~parseInt(mask.toBin().substr(16,16), 2) & 0xffff));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Function:    IPv4Thing_xxxx
//
// Description: Creates a new IPv4Address or IPv4Subnetmask.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
IPv4Thing_fromString = function(ip, theThingToMake, theThingToThrow) {
    if(typeof ip !== 'string')
        throw new theThingToThrow();
    return new theThingToMake(stringToInt(ip, theThingToThrow));
}

IPv4Thing_fromArray = function(ip, theThingToMake, theThingToThrow) {
    if(!Array.isArray(ip))
        throw new theThingToThrow();
    return new theThingToMake(arrayToInt(ip, theThingToThrow));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class:       IPv4Base
//
// Descripton:  A shared base for IPv4Address and IPv4Subnetmask since both have (mostly) the same data and operators.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class IPv4Base {
    constructor(ip) {
        Object.defineProperty(this, 'value', {
            enumerable: true,
            get: function() {
                return ip;
            }
        });
    }

    toString(use3Digits) {
        return (!use3Digits ? this.toArray() : this.toArray().map((v) => {
            v = v.toString();
            return ('0').repeat(3-v.length) + v;
        })).join('.');
    }

    toBin(separator) {
        let binIP = this.value.toString(2);
        binIP = ('0').repeat(32 - binIP.length) + binIP;
        if(separator === undefined)
            separator = '';
        return binIP.substr(0,8) + separator.substr(0,1) + binIP.substr(8,8) + separator.substr(0,1) + binIP.substr(16,8) + separator.substr(0,1) + binIP.substr(24,8)
    }
    
    toArray() {
        let binIP = this.toBin();
        return [
            parseInt(binIP.substr(0,8), 2),
            parseInt(binIP.substr(8,8), 2),
            parseInt(binIP.substr(16,8), 2),
            parseInt(binIP.substr(24,8), 2)
        ]
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class:       IPv4Address
//
// Description: Represents an IPv4 address.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class IPv4Address extends IPv4Base {
    constructor(ip) {
        super(ip);

        Object.defineProperty(this, 'class', {
            enumerable: true,
            get: function() {
                let binIP = this.toBin();
                if(binIP.substr(0,1) == '0')
                    return 'A';
                if(binIP.substr(0,2) == '10')
                    return 'B';
                if(binIP.substr(0,3) == '110')
                    return 'C';
                if(binIP.substr(0,4) == '1110')
                    return 'D';
                return 'E';
            }
        });

        Object.defineProperty(this, 'private', {
            enumerable: true,
            get: function() {
                let ip = this.toString();
                if(ip.substr(0,3) == '10.')
                    return true;
                if(ip.substr(0,8) == '192.168.')
                    return true;
                if(ip.substr(0,4) == '172.') {
                    ip = this.toArray();
                    if((ip[1] >= 16) && (ip[1] <= 31))
                        return true;
                }
                return false;
            }
        });
    }

    mask(subnetMask) {
        return new IPv4Address(maskAnd(this, IPv4Subnetmask.fromAny(subnetMask)));        
    }
}

IPv4Address.fromString = function(ip, theThingToThrow) {
    return IPv4Thing_fromString(ip, IPv4Address, theThingToThrow);
}

IPv4Address.fromArray = function(ip) {
    return IPv4Thing_fromArray(ip, IPv4Address, IPv4AddressError);
}

IPv4Address.fromAny = function(ip) {
    if(typeof ip == 'string')
        return IPv4Address.fromString(ip, IPv4AddressError);
    if(Array.isArray(ip))
        return IPv4Address.fromArray(ip);
    if(ip instanceof IPv4Address)
        return new IPv4Address(ip.value);
    throw new IPv4AddressError();
}    

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class:       IPv4Subnetmask
//
// Description: Represents an IPv4 subnet mask.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class IPv4Subnetmask extends IPv4Base {
    constructor(ip) {
        super(ip);

        Object.defineProperty(this, 'length', {
            enumerable: true,
            get: function() {
                return (this.toBin().match(new RegExp("1", "g")) || []).length;
            }
        });
    }

    invert() {
        return new IPv4Subnetmask(maskInvert(this));        
    }
}

IPv4Subnetmask.fromString = function(ip, theThingToThrow) {
    let mask = IPv4Thing_fromString(ip, IPv4Subnetmask, theThingToThrow);
    if(mask.toBin().indexOf('01') != -1)
        throw new theThingToThrow();
    return mask;
}

IPv4Subnetmask.fromArray = function(ip) {
    let mask = IPv4Thing_fromArray(ip, IPv4Subnetmask, IPv4SubnetmaskError);
     if(mask.toBin().indexOf('01') != -1)
        throw new IPv4SubnetmaskError();
   return mask;
}

IPv4Subnetmask.fromLength = function(length, theThingToThrow) {
    if((length < 0) || (length > 32))
        throw new theThingToThrow();
    let maskBin = ('1').repeat(length) + ('0').repeat(32 - length);
    return new IPv4Subnetmask(parseInt(maskBin.substr(0,16), 2) * factor16 + parseInt(maskBin.substr(16,16), 2));
}

IPv4Subnetmask.fromAny = function(ip) {
    if(typeof ip == 'string')
        return IPv4Subnetmask.fromString(ip, IPv4SubnetmaskError);
    if(Array.isArray(ip))
        return IPv4Subnetmask.fromArray(ip);
    if(typeof ip == 'number')
        return IPv4Subnetmask.fromLength(ip, IPv4SubnetmaskError);
    if(ip instanceof IPv4Subnetmask)
        return new IPv4Subnetmask(ip.value);
    throw new IPv4SubnetmaskError();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class:       IPv4Range
//
// Description: Represents an IPv4 range of addresses.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class IPv4Range {
    constructor(firstAddress, lastAddress) {
        if(firstAddress.value > lastAddress.value) {
            let ipt = firstAddress;
            firstAddress = lastAddress;
            lastAddress = ipt;
        }

        Object.defineProperty(this, 'firstAddress', {
            enumerable: true,
            get: function() {
                return firstAddress;
            }
        });

        Object.defineProperty(this, 'lastAddress', {
            enumerable: true,
            get: function() {
                return lastAddress;
            }
        });

        Object.defineProperty(this, 'length', {
            enumerable: true,
            get: function() {
                return this.lastAddress.value - this.firstAddress.value + 1;
            }
        });
    }

    contains(ip) {
        ip = IPv4Address.fromAny(ip);
        return (ip.value >= this.firstAddress.value) && (ip.value <= this.lastAddress.value);
    }

    *getIterator() {
        let current = this.firstAddress.value;
        while(current <= this.lastAddress.value) 
            yield new IPv4Address(current++);
    }
}

IPv4Range.fromString = function(str) {
    let splitDash = str.split('-');
    if(splitDash.length > 2)
        throw new IPv4RangeError();
    if(splitDash.length == 2)
        return new IPv4Range(IPv4Address.fromString(splitDash[0], IPv4RangeError), IPv4Address.fromString(splitDash[1], IPv4RangeError));
    throw new IPv4RangeError();
}

IPv4Range.fromAny = function(ip) {
    if(typeof ip == 'string')
        return IPv4Range.fromString(ip);
    if(ip instanceof IPv4Range)
        return new IPv4Range(ip.firstAddress, ip.lastAddress);
    throw new IPv4RangeError();
}    

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Class:       IPv4Subnet
//
// Description: Represents an IPv4Subnet.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class IPv4Subnet extends IPv4Range {
    constructor(netAddress, subnetMask) {
        let broadcastAddress = new IPv4Address(maskOr(netAddress, subnetMask.invert()));
        
        super(netAddress, broadcastAddress);

        Object.defineProperty(this, 'subnetMask', {
            enumerable: true,
            get: function() {
                return subnetMask;
            }
        });
        Object.defineProperty(this, 'networkAddress', {
            enumerable: true,
            get: function() {
                return netAddress;
            }
        });
        Object.defineProperty(this, 'broadcastAddress', {
            enumerable: true,
            get: function() {
                return broadcastAddress;
            }
        });
        Object.defineProperty(this, 'hosts', {
            enumerable: true,
            get: function() {
                return this.length - 2;
            }
        });
    }
    *getHostsIterator() {
        let current = (this.networkAddress.value + 1);
        while(current <= (this.broadcastAddress.value - 1)) 
            yield new IPv4Address(current++);
    }
}

IPv4Subnet.fromString = function(str) {
    let splitSlash = str.split('/');
    if(splitSlash.length > 2)
        throw new IPv4SubnetError();
    if(splitSlash.length == 2) {
        let ip   = IPv4Address.fromString(splitSlash[0], IPv4SubnetError);
        let mask = onlyDigits(splitSlash[1]) ? IPv4Subnetmask.fromLength(splitSlash[1], IPv4SubnetError) : IPv4Subnetmask.fromString(splitSlash[1], IPv4SubnetmaskError);
        return new IPv4Subnet(ip.mask(mask), mask);
    }
    throw new IPv4SubnetError();
}

IPv4Subnet.fromAny = function(ip) {
    if(typeof ip == 'string')
        return IPv4Subnet.fromString(ip);
    if(ip instanceof IPv4Subnet)
        return new IPv4Subnet(ip.networkAddress, ip.subnetMask);
    throw new IPv4SubnetError();
}    

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
    address:        IPv4Address.fromAny,
    range:          IPv4Range.fromAny,
    subnet:         IPv4Subnet.fromAny,
    subnetmask:     IPv4Subnetmask.fromAny
}