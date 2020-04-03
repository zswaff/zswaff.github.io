function selectWithoutReplacement(arr, n) {
    const inds = new Set();
    const res = [];
    for (let i = 0; i < n; i++) {
        const ind = Math.floor(Math.random() * arr.length);
        if (inds.has(ind)) {
            i--;
            continue;
        }
        inds.add(ind);
        res.push(arr[ind]);
    }
    res.sort();
    return res;
}
