// Algorithm to count matching pairs (modular equality)
function getNumberOfGoodPairs(base, mod) {
    let i = 1n;
    let list = {};

    while ((i) < mod) {
        let n = (base**i) % mod;
        
        if (!list[n]) {
            list[n] = 1;
        }
        console.log(list[n],Object.keys(list).length,n);
        
        list[n]++;
        i++;
    }

    return list;
}

// Example usage
const base = 29n;
const mod = 5937137n;
const result = getNumberOfGoodPairs(base, mod);
console.log(result);

