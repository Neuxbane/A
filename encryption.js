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

    compression(inputString) {
        let compressedString = inputString;
        let substituteChar = '';
        let patternFound = true;
        let pairOfReplacement = [];

        // Loop until no more patterns can be compressed
        while (patternFound) {
            const uniqueChars = new Set(compressedString);
            substituteChar = '';

            // Find a unique character to use as a substitute
            for (let i = 1; i < 0xfff; i++) {
                const char = String.fromCharCode(i);
                if (!uniqueChars.has(char)) {
                    substituteChar = char;
                    break;
                }
            }
    
            if (!substituteChar) {
                break;
            }
    
            const patterns = {};
            // Identify patterns that appear more than once
            for (let length = 3; length <= compressedString.length / 2; length++) {
                for (let start = 0; start <= compressedString.length - length; start++) {
                    const substr = compressedString.substring(start, start + length);
                    if (patterns[substr]) continue;
                    const regex = new RegExp(substr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
                    const count = (compressedString.match(regex) || []).length;
                    if (count > 1) {
                        patterns[substr] = { count: count, length: substr.length };
                    }
                }
            }
    
            let bestPattern = '';
            let bestScore = 0;
            // Select the most effective pattern to replace
            Object.keys(patterns).forEach(pattern => {
                const score = patterns[pattern].count * patterns[pattern].length;
                if (score > bestScore) {
                    bestPattern = pattern;
                    bestScore = score;
                }
            });
    
            // Replace the best pattern with the substitute character
            if (bestPattern&&bestPattern!=='') {
                compressedString = compressedString.split(bestPattern).join(substituteChar);
                pairOfReplacement.push([bestPattern, substituteChar]);
                patternFound = true;
            } else {
                patternFound = false;
            }
        }
    
        // Construct the final compressed string with header information
        return `${String.fromCharCode(pairOfReplacement.length)}${pairOfReplacement.map(pair => `${String.fromCharCode(pair[0].length)}${pair[0]}${pair[1]}`).join('')}${compressedString}`;
    }

    decompression(compressedString) {
        // Extract the header information
        const headerLength = compressedString.charCodeAt(0);
        let index = 1;
        const replacements = [];
    
        // Retrieve all patterns and their substitutions
        for (let i = 0; i < headerLength; i++) {
            const patternLength = compressedString.charCodeAt(index);
            const pattern = compressedString.substring(index + 1, index + 1 + patternLength);
            const substitute = compressedString[index + 1 + patternLength];
            replacements.push([pattern, substitute]);
            index += 1 + patternLength + 1;
        }
    
        // The remaining part of the string is the compressed data
        let decompressedString = compressedString.substring(index);
    
        // Replace all substitute characters with their original patterns
        replacements.reverse().forEach(replacement => {
            const [pattern, substitute] = replacement;
            const regex = new RegExp(substitute, 'g');
            decompressedString = decompressedString.replace(regex, pattern);
        });
    
        return decompressedString;
    }

    // Establish a shared key using another party's public key
    establishKey(publicKey){
        const sharedSecret = (BigInt(publicKey)**this.#privateKey) % this.modulo;
        this.#keys[publicKey] = sharedSecret;
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
const compressedMessageFromAlice = eve.compression(messageFromAlice);
const encryptedMessage = alice.encrypt(compressedMessageFromAlice, bob.publicKey);
console.log("Encrypted and Compressed Message from Alice to Bob:", encryptedMessage);

// Eve tries to decrypt the message using her own private key and Alice's public key
eve.establishKey(alice.publicKey);
const interceptedMessageByEve = eve.decrypt(encryptedMessage, alice.publicKey);
// const decompressedInterceptedByEve = eve.decompression(interceptedMessageByEve);
// console.log("Intercepted, Decrypted, and Decompressed Message by Eve:", decompressedInterceptedByEve);

// Bob decrypts Alice's message
const decryptedMessage = bob.decrypt(encryptedMessage, alice.publicKey);
const decompressedMessage = eve.decompression(decryptedMessage);
console.log("Decrypted and Decompressed Message at Bob's end:", decompressedMessage);

// Bob replies to Alice
const messageFromBob = "Hi Alice! (^_^)";
const compressedReplyFromBob = eve.compression(messageFromBob);
const encryptedReply = bob.encrypt(compressedReplyFromBob, alice.publicKey);
console.log("Encrypted and Compressed Reply from Bob to Alice:", encryptedReply);

// Eve tries to decrypt the reply using her own private key and Bob's public key
eve.establishKey(bob.publicKey);
const interceptedReplyByEve = eve.decrypt(encryptedReply, bob.publicKey);
// const decompressedReplyByEve = eve.decompression(interceptedReplyByEve);
// console.log("Intercepted, Decrypted, and Decompressed Reply by Eve:", decompressedReplyByEve);

// Alice decrypts Bob's reply
const decryptedReply = alice.decrypt(encryptedReply, bob.publicKey);
const decompressedReply = eve.decompression(decryptedReply);
console.log("Decrypted and Decompressed Reply at Alice's end:", decompressedReply);

