const express = require('express');
const router = express.Router();

module.exports = router;

const verifyToken = require('../middleware/authMiddleware.js');

/**
 * Middlewares for body field validations
 */
const {
    validateEmail,
    validateLegalAge,
    validatePhoneNumber,
    validateSixDigitNumber,
    validateVideoUrl
}  = require('../middleware/middlewares.js')

/**
 * Users
 */
const {
    userPost,
    userGet,
    userPinGet
} = require("../controllers/userController.js");

/**
 * Playlist
 */
const {
    playlistPost, 
    playlistPatch,
    playlistDelete
} = require("../controllers/playlistController.js");

/**
 * Videos
 */
const {
    videoPost,
    videoPatch,
    videoDelete
} = require("../controllers/videoController.js");

/**
 * profiles
 */
const {
    profilePost,
    profilePatch,
    profileDelete,
    pinGet,
    avatarGet
} = require("../controllers/profileController.js");


/**
 * Listen to the task request
 * 
 * users
 */
router.post("/session", userGet);

router.post("/users",
    validateEmail,
    validateLegalAge,
    validatePhoneNumber,
    validateSixDigitNumber,
    userPost
);
router.get("/users/pin", verifyToken, userPinGet);

/**
 * Playlist
 */
router.post("/playlists", verifyToken, playlistPost);
router.patch("/playlists", verifyToken, playlistPatch);
router.delete("/playlists", verifyToken, playlistDelete);

/**
 * videos
 */
router.post("/videos", 
    verifyToken,
    validateVideoUrl,
    videoPost
);

router.patch("/videos", 
    verifyToken, 
    validateVideoUrl,
    videoPatch
);

router.delete("/videos", verifyToken, videoDelete);

/**
 * profiles
 */
router.post("/profiles", 
    verifyToken, 
    validateSixDigitNumber,
    profilePost
);

router.patch("/profiles", 
    verifyToken, 
    validateSixDigitNumber,
    profilePatch
);

router.delete("/profiles", verifyToken, profileDelete);

router.get("/profiles/pin", verifyToken, pinGet);

/**
 * avatars
 */
router.get("/profiles/avatar", verifyToken, avatarGet);