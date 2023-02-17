const deleteProduct = async (btn) => {
    const productId = btn.parentNode.querySelector("[name=productId]").value;
    const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
    const productElement = btn.closest("article");

    try {
        const result = await fetch("/admin/product/" + productId, {
            method: "DELETE",
            headers: {
                "csrf-token": csrf,
            },
        });
        await productElement.parentNode.removeChild(productElement);
        const data = await result.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
};
