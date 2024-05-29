# Encryption Project

This project demonstrates asymmetric encryption using public and private keys. It includes implementations for encryption, decryption, and key establishment.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project showcases the use of asymmetric encryption for secure communication. It includes classes for encryption, decryption, and key establishment.

## Features

- Asymmetric encryption using public and private keys
- Key establishment between parties
- Encryption and decryption of messages

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.

## Usage

```javascript
// Example code snippets for using the encryption class

// Initialize parties with public and private keys
const alice = new encryption(29, 2633);
const bob = new encryption(29, 2633);

// Establish keys between parties
alice.establishKey(bob.publicKey);
bob.establishKey(alice.publicKey);

// Encrypt and decrypt messages
const messageFromAlice = "Hello Bob! (≧◡≦)";
const encryptedMessage = alice.encrypt(messageFromAlice, bob.publicKey);
const decryptedMessage = bob.decrypt(encryptedMessage, alice.publicKey);

console.log("Decrypted Message at Bob's end:", decryptedMessage);
```

## Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

