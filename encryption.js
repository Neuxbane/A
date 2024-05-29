class encryption {
    constructor(base, modulo){
        this.base = BigInt(base);
        this.modulo = BigInt(modulo);
        this.privateKey = BigInt(Math.round(Math.random()*1000));
        this.publicKey = (this.base**this.privateKey) % this.modulo;
        this.keys = {};
    }

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

    establishKey(publicKey){
        const sharedSecret = (BigInt(publicKey)**this.privateKey) % this.modulo;
        this.keys[publicKey] = sharedSecret;
        console.log(`Established key with public key ${publicKey}: ${sharedSecret}`);
    }
    
    encrypt(message, publicKey){
        const key = Number(this.keys[publicKey]);
        return message.split('').map((char, i) => {
            const encodedChar = (char.charCodeAt(0) + Math.round(Math.sin(i * key) * key)); // Use modulo to wrap around Unicode range
            return String.fromCharCode(encodedChar);
        }).join('');
    }

    decrypt(message, publicKey){
        const key = Number(this.keys[publicKey]);
        return message.split('').map((char, i) => {
            const decodedChar = (char.charCodeAt(0) - Math.round(Math.sin(i * key) * key)); // Use modulo to wrap around Unicode range and handle negative values
            return String.fromCharCode(decodedChar);
        }).join('');
    }
}
const alice = new encryption(29, 2633);
const bob = new encryption(29, 2633);
const eve = new encryption(29, 2633); // Eve is the third person trying to intercept the messages

alice.establishKey(bob.publicKey);
bob.establishKey(alice.publicKey);

const messageFromAlice = "Hello Bob! (≧◡≦)";
const encryptedMessage = alice.encrypt(messageFromAlice, bob.publicKey);
console.log("Encrypted Message from Alice to Bob:", encryptedMessage);

// Eve tries to decrypt the message using her own private key and Alice's public key
eve.establishKey(alice.publicKey);
const interceptedMessageByEve = eve.decrypt(encryptedMessage, alice.publicKey);
console.log("Intercepted and Decrypted Message by Eve:", interceptedMessageByEve);

const decryptedMessage = bob.decrypt(encryptedMessage, alice.publicKey);
console.log("Decrypted Message at Bob's end:", decryptedMessage);

const messageFromBob = "Hi Alice! (^_^)";
const encryptedReply = bob.encrypt(messageFromBob, alice.publicKey);
console.log("Encrypted Reply from Bob to Alice:", encryptedReply);

// Eve tries to decrypt the reply using her own private key and Bob's public key
eve.establishKey(bob.publicKey);
const interceptedReplyByEve = eve.decrypt(encryptedReply, bob.publicKey);
console.log("Intercepted and Decrypted Reply by Eve:", interceptedReplyByEve);

const decryptedReply = alice.decrypt(encryptedReply, bob.publicKey);
console.log("Decrypted Reply at Alice's end:", decryptedReply);

