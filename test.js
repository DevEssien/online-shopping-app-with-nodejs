// User.updateOne(
//     { _id: "63aeeda272901c8f49db2c2b" },
//     { cart: { items: [] } },
//     (err) => {
//         if (!err) {
//             console.log("updated user successfully");
//         }
//     }
// const keys = Object.keys(cartItem)?.length; //check if object is empty
// if (keys === 0) {
//     res.redirect("/cart");
// }

const obj = { items: [] };
// const keys = Object.keys(obj)?.length;
// console.log(keys);
obj.items.push({ prod: 1 });
obj.items.push({ air: 2 });

console.log(obj);
// console.log(obj.items[0].prod);

const arr = { items: [{}] };
arr.items.forEach((product, ind) => {
    console.log(product);
    if (product.id !== "productId") {
        console.log("ok");
        // arr.items[ind].id = "new productId";
        product.id = "new id";
        // arr[product].quantity = 1;
        // // console.log(productId, newQuantity)
    } else {
        console.log("false");
    }
});
console.log(arr);
