const jwt = require("jsonwebtoken");


export const verifyToken =   async (req, res, next)  =>{

    try {
        let checkToken = req.header("Authorization");
        if (!checkToken) {
          return res.status(404).json("token doesnot exits");
        }
        if (checkToken.startsWith("Bearer ")) {
            let token =   checkToken.split(" ")[1];

        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();

    } catch (error) {
        return res.status(504).json({error : error.message});
    }
}


