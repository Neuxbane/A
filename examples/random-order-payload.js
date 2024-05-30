const { Encryption } = require('./../encryption');

// We agree that we use this base and modulus as public parameters
const base = 29;
const modulus = 5937137;

// Initialize encryption objects for Alice and Bob
const alice = new Encryption(base, modulus);
const bob = new Encryption(base, modulus);

bob.establishKey(alice.publicKey);
alice.establishKey(bob.publicKey);


/*
    Random order communication problem.
*/

// Let's say alice send a multiple messages to bob.
const rdmfirstMessage = alice.encrypt("Bob!", bob.publicKey);
const rdmsecondMessage = alice.encrypt("Do you have any free time?", bob.publicKey);

// Because some delay, the message is not delivered in the same order.
const firstMessageDecrypted = bob.decrypt(rdmsecondMessage, alice.publicKey); // First message that Bob's received
const secondMessageDecrypted = bob.decrypt(rdmfirstMessage, alice.publicKey); // Second message that Bob's received

console.log("First message from Alice:", firstMessageDecrypted.message); // It's return error because it's not in order.
console.log("Second message from Alice:", secondMessageDecrypted); // Returns: Bob!
console.log("Redecrypt First message from Alice:", bob.decrypt(rdmsecondMessage, alice.publicKey)); // Successfuly decrypt because it's in order.


/*
    This non-order problem can cause a deadlock if one message is gone forever and never delivered to the receiver.
*/


const firstMessage = alice.encrypt("Hello Bob!", bob.publicKey);
const missingMessage = alice.encrypt("I want to tell you that I...", bob.publicKey);
const thirdMessage = alice.encrypt("...I was graduated from school!", bob.publicKey);

console.log("Bob received: ", bob.decrypt(firstMessage, alice.publicKey));
console.log("Bob received: ", bob.decrypt(thirdMessage, alice.publicKey).message);
// When Bob recieved an error then bob send an ARQ to Alice;
const bobARQ = bob.sendARQ(alice.publicKey);
// Alice replies the ARQ
const theARQMessage = alice.receiveARQ(bobARQ, bob.publicKey);
for(let message of theARQMessage){
    console.log("Bob received from ARQ: ", bob.decrypt(message, alice.publicKey))
}