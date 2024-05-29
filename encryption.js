class Encryption {
    #privateKey = BigInt(Math.round(Math.random()*1000)); // Randomly generated private key
    #keys = {}; // Object to store established keys
    constructor(base, modulo){
        this.base = BigInt(base); // Base for the encryption calculations
        this.modulo = BigInt(modulo); // Modulo for the encryption calculations
        this.publicKey = (this.base**this.#privateKey) % this.modulo; // Public key derived from base and private key
    }

    // Function to get the i-th prime number
    getPrime(i) {
        const isPrime = n => {
            for (let j = 2; j * j <= n; j++)
                if (n % j === 0) return false;
            return n > 1;
        };

        for (let num = 2, count = 0;; num++) {
            if (isPrime(num) && ++count === i) return num;
        }
    }

    // Establish a shared key using another party's public key
    establishKey(publicKey){
        const sharedSecret = (BigInt(publicKey)**this.#privateKey) % this.modulo;
        this.#keys[publicKey] = sharedSecret;
        console.log(`Established key with public key ${publicKey}: ${sharedSecret}`);
    }
    
    // Encrypt a message using a previously established key
    encrypt(message, publicKey){
        const key = Number(this.#keys[publicKey]);
        return message.split('').map((char, i) => {
            const encodedChar = (char.charCodeAt(0) + Math.round(Math.sin((i + key) * key) * key)); // Use modulo to wrap around Unicode range
            return String.fromCharCode(encodedChar);
        }).join('');
    }

    // Decrypt a message using a previously established key
    decrypt(message, publicKey){
        const key = Number(this.#keys[publicKey]);
        return message.split('').map((char, i) => {
            const decodedChar = (char.charCodeAt(0) - Math.round(Math.sin((i + key) * key) * key)); // Use modulo to wrap around Unicode range and handle negative values
            return String.fromCharCode(decodedChar);
        }).join('');
    }
}

// Initialize encryption objects for Alice, Bob, and Eve
const alice = new Encryption(29, 5937137);
const bob = new Encryption(29, 5937137);
const eve = new Encryption(29, 5937137); // Eve is the third person trying to intercept the messages

// Establish keys between Alice and Bob
alice.establishKey(bob.publicKey);
bob.establishKey(alice.publicKey);

// Alice sends a message to Bob
const messageFromAlice = "你好鲍勃！(≧◡≦)"; // "Hello Bob! (≧◡≦)"
const encryptedMessage = alice.encrypt(messageFromAlice, bob.publicKey);
console.log("Encrypted Message from Alice to Bob:", encryptedMessage);

// Eve tries to decrypt the message using her own private key and Alice's public key
eve.establishKey(alice.publicKey);
const interceptedMessageByEve = eve.decrypt(encryptedMessage, alice.publicKey);
console.log("Intercepted and Decrypted Message by Eve:", interceptedMessageByEve);

// Bob decrypts Alice's message
const decryptedMessage = bob.decrypt(encryptedMessage, alice.publicKey);
console.log("Decrypted Message at Bob's end:", decryptedMessage);

// Bob replies to Alice
const messageFromBob = "Hi Alice! (^_^)";
const encryptedReply = bob.encrypt(messageFromBob, alice.publicKey);
console.log("Encrypted Reply from Bob to Alice:", encryptedReply);

// Eve tries to decrypt the reply using her own private key and Bob's public key
eve.establishKey(bob.publicKey);
const interceptedReplyByEve = eve.decrypt(encryptedReply, bob.publicKey);
console.log("Intercepted and Decrypted Reply by Eve:", interceptedReplyByEve);

// Alice decrypts Bob's reply
const decryptedReply = alice.decrypt(encryptedReply, bob.publicKey);
console.log("Decrypted Reply at Alice's end:", decryptedReply);


