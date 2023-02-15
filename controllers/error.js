exports.catch404Error = (req, res, next) => {
    res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "/404",
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.catch500Error = (req, res, next) => {
    res.status(500).render("500", {
        pageTitle: "Server Error",
        path: "/500",
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.throwError = (err, next) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
};
