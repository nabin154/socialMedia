const express  = require("express");
const router  = express.Router();
const {loginUser, getNewAccessToken}  = require("../controllers/authController")


router.route('/login').post(loginUser);
router.route('/refresh_token').post(getNewAccessToken);

module.exports = router;