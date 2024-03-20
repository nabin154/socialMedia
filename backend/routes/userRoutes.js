const express = require("express");
const router = express.Router();

router.route("/:userId").post(allUsers);

module.exports = router;
