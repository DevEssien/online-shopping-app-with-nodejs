const arr = [1, 2, 3, 4, 5];

const a = 4;
let iter = 0;
for (let elem of arr) {
    if (elem === a) {
        console.log("true");
    }

    iter += 1;
}
arr.push(a);
console.log(arr, iter);
