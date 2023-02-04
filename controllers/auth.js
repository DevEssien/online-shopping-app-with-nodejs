const getLogin = (req, res, next) => {
    const isLoggedIn =
        req.get("Cookie")?.split(";")[0]?.trim()?.split("=")[1] === "true";
    console.log(isLoggedIn);
    console.log("session", JSON.stringify(req?.session, null, 2));
    res.render("auth/login", {
        path: "/login",
        pageTitle: "login",
        isAuthenticated: isLoggedIn,
    });
};

const postLogin = (req, res, next) => {
    // res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
    req.session.isLoggedIn = true;
    res.redirect("/");
};

module.exports = { getLogin, postLogin };
