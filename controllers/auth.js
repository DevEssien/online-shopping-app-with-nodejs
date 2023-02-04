const getLogin = (req, res, next) => {
    const isLoggedIn = req.get("Cookie").split("=")[1];
    console.log(isLoggedIn);
    res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
        isAuthenticated: isLoggedIn,
    });
};

const postLogin = (req, res, next) => {
    res.setHeader("Set-Cookie", "loggedIn=true");
    res.redirect("/");
};

module.exports = { getLogin, postLogin };
