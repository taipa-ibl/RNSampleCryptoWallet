// Inject node globals into React Native global scope.
// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
global.process = require('process');
global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

if (typeof __dirname === 'undefined') global.__dirname = '/';
if (typeof __filename === 'undefined') global.__filename = '';

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: 'file:'
};

if (typeof btoa === 'undefined') {
  global.btoa = function(str) {
    return new Buffer(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function(b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString('binary');
  };
}

global.crypto = {
  getRandomValues(byteArray) {
    let randomBytes = require('react-native-randombytes').randomBytes;
    const bytes = randomBytes(byteArray.length);
    for (var i = 0; i < bytes.length; i++) {
      byteArray[i] = bytes[i];
    }
  }
};
