function selectWithoutReplacement(arr, n) {
    var inds = new Set();
    var res = [];
    for(var i = 0; i < n; i++) {
        var ind = Math.floor(Math.random() * arr.length);
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
