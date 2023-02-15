const sum = (a, b) => {
    if (!(a && b)) {
        throw new Error("Invalid Error");
    }
    return a + b;
};

try {
    console.log(sum(2));
} catch (error) {
    console.log("Error occured");
}
console.log("But then this still works");
