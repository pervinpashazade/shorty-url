const jwt = required("jsonwebtoken");

verifyToken = (req, res, next) => {
    const reqHeaderAuth = req.headers.authorization;

    if (reqHeaderAuth) {
        const token = reqHeaderAuth.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ status: false, message: 'Invalid token!' });
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    }
}

verifyAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        // if (req.user.id === req.params.id) {
        //     next();
        // } else {
        //     return res.status(403).json({ status: false, message: 'Access Forbidden!' });
        // }
        next();
    });
};

module.exports = {
    verifyToken: verifyToken,
    verifyAuth: verifyAuth
}