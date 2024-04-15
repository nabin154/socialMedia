const express  = require("express");
const router  = express.Router();
const {loginUser, getNewAccessToken,logoutUser}  = require("../controllers/authController")
const verifyToken = require('../middlewares/protectMiddleware');


router.route('/login').post(loginUser);
router.route('/refresh_token').post(getNewAccessToken);
router.route('/logout').post(verifyToken, logoutUser);

module.exports = router;