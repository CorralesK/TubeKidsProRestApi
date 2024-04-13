const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Scheme for playlists
 */
const playlist = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    profiles: [{ type: Schema.Types.ObjectId, ref: 'Profile'}]
});

module.exports = mongoose.model('Playlist', playlist);