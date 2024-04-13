const Video = require("../models/videoModel.js");
const Playlist = require("../models/playlistModel.js");

const {playlistUpdate} = require("./playlistController.js");

/**
 * Method to create a video and add it to the playlist
 *
 * @param {*} req
 * @param {*} res
 */
const videoPost = async (req, res) => {
    try {
        if (!req.body.playlistId) {
            res.status(404).json({ error: "Playlist ID not specified" });
        }
        const video = new Video({
            name: req.body.name,
            url: req.body.url,
            description: req.body.description
        });

        const playlist = playlistUpdate(video, req.body.playlistId);
        if (!playlist) {
            return res.status(422).json({ error: 'There was an error updating the playlist' });
        }

        const savedVideo = await video.save();
        res.header({ 'location': `/api/videos/?id=${savedVideo.id}` });
        res.status(201).json(savedVideo);
    } catch (error) {
        console.error('Error while saving the video:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Updates the data of a video by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const videoPatch = async (req, res) => {
    try {
        if (!req.query || !req.query._id) {
            return res.status(400).json({ error: "Video ID is required" });
        }

        const video = await Video.findById(req.query._id);

        if (!video) {
            return res.status(404).json({ error: "Video doesn't exist" });
        }

        video.name = req.body.name ?? video.name;
        video.url = req.body.url ?? video.url;
        video.description = req.body.description ?? video.description;

        const updatedVideo = await video.save();

        if (!updatedVideo) {
            res.status(422).json({ error: 'There was an error saving the video' });
        }

        res.status(201).json(updatedVideo);
    } catch (error) {
        console.error('Error while updating video:', error);
        res.status(500).json({ error: 'There was an error updating the video' });
    }
}

/**
 * Delete a video by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const videoDelete = async (req, res) => {
    try {
        if (!req.query || !req.query._id) {
            return res.status(400).json({ error: "Video ID is required" });
        }

        const video = await Video.findById(req.query._id);

        if (!video) {
            return res.status(404).json({ error: "Video does not exist" });
        }

        const playlist = await Playlist.findOneAndUpdate(
            { userId: req.userId },
            { $pull: { videos: req.query._id } },
            { new: true }
        );

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        await video.deleteOne();
        res.status(204).json({});
    } catch (error) {
        console.error('Error while deleting the video:', error);
        res.status(422).json({ error: 'There was an error deleting the video' });
    }
}

module.exports = {
    videoPost,
    videoPatch,
    videoDelete
}