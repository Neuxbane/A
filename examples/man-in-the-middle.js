const { Encryption } = require('./../encryption');

// We agree that we use this base and modulus as public parameters
const base = 29;
const modulus = 5937137;

// Initialize encryption objects for Alice, Bob, and Eve
const alice = new Encryption(base, modulus);
const bob = new Encryption(base, modulus);

bob.establishKey(alice.publicKey);
alice.establishKey(bob.publicKey);


const eve = new Encryption(base, modulus); // Eve is the third person trying to intercept the messages
eve.establishKey(alice.publicKey);
eve.establishKey(bob.publicKey);


/*
    Man in the middle problem. (Solved)
*/

// Firstly, Alice send a message to bob.
const encryptedMessage = alice.encrypt("Hello, Bob!", bob.publicKey);
console.log("Encrypted message from Alice:",encryptedMessage);

// Eve tries to decrypt the message
const decryptedEveMessage = eve.decrypt(encryptedMessage, alice.publicKey);
console.log("Decrypted message by Eve:", decryptedEveMessage.message); // Returns Error: Hash mismatch;
// This is because the message is encrypted with the pair of Bob's and Alice's private key.
// Eve can decrypt the message if the message is encrypted with the pair of Eve's and Bob's private key.

// Bob tries to decrypt the message and succesfully decrypts it
const decryptedMessage = bob.decrypt(encryptedMessage, alice.publicKey);
console.log("Decrypted message by Bob:", decryptedMessage); // Returns Hello, Bob!

// Bob replies to Alice with another message
const anotherEncryptedMessage = bob.encrypt("How are you Alice!", alice.publicKey);
console.log("Encrypted message from Bob:", anotherEncryptedMessage);

// Eve tries to holds Bob's message and spamming the encrypted original message to alice.
const eveHoldsAliceMessage = anotherEncryptedMessage;
console.log("Eve holds Alice's message:", eveHoldsAliceMessage);
for(let i = 0; i < 3; i++){
    const payload = alice.decrypt(eveHoldsAliceMessage, bob.publicKey)
    console.log(`Eve spamming ${i+1} time(s) to Alice:`, i?payload.message:payload);
}

// Alice tries to decrypt the last encrypted message and did not succesfully decrypt it
const anotherDecryptedMessage = alice.decrypt(anotherEncryptedMessage, bob.publicKey);
console.log("Decrypted message by Alice:", anotherDecryptedMessage.message);
// This is not a problem since Alice successfully get only the first message that delivered by Eve.
// And Eve is not able to decrypt the message since the message is encrypted with the pair of Bob's and Alice's private key.
