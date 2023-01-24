const arr = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
];
const c = 4;
const a = arr.filter((obj) => {
    if (obj.id !== c) {
        console.log(obj);
        return obj;
    }
});
console.log(a);
