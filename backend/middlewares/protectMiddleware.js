const jwt = require("jsonwebtoken");


const verifyToken = async (req, res, next) => {

    try {
        let checkToken = req.header("Authorization")?.replace("Bearer ", "")
            || req.cookies?.accessToken;
        if (!checkToken) {
            return res.status(401).json("token doesnot exits");
        }
        const verified = jwt.verify(checkToken, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }

    catch (error) {
        return res.status(401).json({ error: error.message });
    }
}


module.exports = verifyToken;