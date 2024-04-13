const Playlist = require("../models/playlistModel.js");
const Video = require("../models/videoModel.js");

/**
 * Method to create a playlist and add it to the playlist
 *
 * @param {*} req
 * @param {*} res
 */
const playlistPost = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(404).json({ error: "User ID not specified" });
        }
        const playlist = new Playlist({
            userId: req.userId, 
            name: req.body.name,
            videos: [],
            profiles: req.body.profiles
        });

        const savedPlaylist = await playlist.save();
        res.header({ 'location': `/api/playlists/?id=${savedPlaylist.id}` });
        res.status(201).json(savedPlaylist);
    } catch (error) {
        console.error('Error while saving the playlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Method to add the video to the playlist.
 *
 * @param {*} video The video to be added to the playlist.
 * @param {*} id The ID of the playlist.
 * 
 * @returns {boolean} true if the operation was successful, false if there was an error.
 */
const playlistUpdate = async (video, id) => {
    try {
        let playlist = await Playlist.findById(id);

        if (!playlist) {
            console.error("Playlist doesn't exist:", error );
            return false;
        }

        playlist.videos.push(video._id);

        await playlist.save();

        return true;
    } catch (error) {
        console.error('Error while updating playlist:', error);
        return false;
    }
}

/**
 * Updates the data of a playlist by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const playlistPatch = async (req, res) => {
    try {
        if (!req.query || !req.query._id) {
            return res.status(400).json({ error: "Playlist ID is required" });
        }

        const playlist = await Playlist.findById(req.query._id);

        if (!playlist) {
            return res.status(404).json({ error: "Playlist doesn't exist" });
        }

        playlist.name = req.body.name ?? playlist.name;
        playlist.profiles = req.body.profiles ?? playlist.profiles;

        const updatedPlaylist = await playlist.save();

        if (!updatedPlaylist) {
            res.status(422).json({ error: 'There was an error saving the playlist' });
        }

        res.header({ 'location': `/api/playlists/?id=${updatedPlaylist.id}` });
        res.status(201).json(updatedPlaylist);
    } catch (error) {
        console.error('Error while updating playlist:', error);
        res.status(500).json({ error: 'There was an error updating the playlist' });
    }
}

/**
 * Delete a playlist by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const playlistDelete = async (req, res) => {
    try {
        if (!req.query || !req.query._id) {
            return res.status(400).json({ error: "Playlist ID is required" });
        }

        const playlist = await Playlist.findById(req.query._id);

        if (!playlist) {
            return res.status(404).json({ error: "Playlist does not exist" });
        }

        await playlist.deleteOne();

        await Video.deleteMany({ _id: { $in: playlist.videos } });

        res.status(204).json({});
    } catch (error) {
        console.error('Error while deleting the playlist:', error);
        res.status(422).json({ error: 'There was an error deleting the playlist' });
    }
}

module.exports = {
    playlistPost,
    playlistUpdate,
    playlistPatch,
    playlistDelete
}