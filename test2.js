const arr = [
    {
        productId: 1234,
        quantity: 1,
    },
];

arr.forEach((item, ind) => {
    const product = {
        id: 1234,
        title: "book",
        description: "just  a book",
    };
    arr[ind].productId = product;
});
console.log(arr);
