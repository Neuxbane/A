function simpleCompression(inputString) {
    let compressedString = inputString;
    let substituteChar = '';
    let patternFound = true;
    let pairOfReplacement = [];
    while (patternFound) {
        const uniqueChars = new Set(compressedString);
        substituteChar = '';
        for (let i = 0; i < 0xfff; i++) {
            const char = String.fromCharCode(i);
            if (!uniqueChars.has(char)) {
                substituteChar = char;
                break;
            }
        }

        if (!substituteChar) {
            console.log("No available character for substitution! (＞﹏＜)");
            break;
        }

        const patterns = {};
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
        Object.keys(patterns).forEach(pattern => {
            const score = patterns[pattern].count * patterns[pattern].length;
            if (score > bestScore) {
                bestPattern = pattern;
                bestScore = score;
            }
        });

        if (bestPattern) {
            compressedString = compressedString.replace(new RegExp(bestPattern, 'g'), substituteChar);
            pairOfReplacement.push([bestPattern, substituteChar]);
            console.log(`Compressed using '${substituteChar}' to represent '${bestPattern}'. (≧◡≦)`);
            patternFound = true;
        } else {
            console.log("No pattern effective enough to compress. (｡•́︿•̀｡)");
            patternFound = false;
        }
    }

    return `${String.fromCharCode(pairOfReplacement.length)}${pairOfReplacement.map(pair => `${String.fromCharCode(pair[0].length)}${pair[0]}${pair[1]}`).join('')}${compressedString}`;
}

function simpleDecompression(compressedString) {
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


// Test case
const testString = "Hello, my name is bob! Your name is Alice right? bob";
console.log("Original:", testString);
const compressedString = simpleCompression(testString);
console.log("Compressed:", compressedString);

const originalLength = testString.length;
const compressedLength = compressedString.length;
const compressionRatio = (compressedLength / originalLength).toFixed(2);
const bufferRatio = (Buffer.byteLength(compressedString, 'utf-8') / Buffer.byteLength(testString, 'utf-8')).toFixed(2);
console.log(`Original Length: ${originalLength} characters (✿◠‿◠)`);
console.log(`Compressed Length: ${compressedLength} characters (✿◠‿◠)`);
console.log(`Compression Ratio: ${compressionRatio} (compressed/original) (✿◠‿◠)`);
console.log(`Buffer Ratio: ${bufferRatio} (compressed buffer/original buffer) (✿◠‿◠)`);

const decompressedString = simpleDecompression(compressedString); // You need to replace 'substituteChar' and 'originalPattern' with actual values used in compression
console.log("Decompressed:", decompressedString); // Adding this line to show the decompressed output (≧◡≦)

