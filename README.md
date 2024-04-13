# TubeKidsBackend

This project is part of the Web Environment Programming II course (Code: ISW-711) of the Universidad Técnica Nacional, under the direction of Professor Bladimir Arroyo.

## Description

The TubeKidsBackend is a REST API service that provides functions to manage users, profiles, and playlists. It allows users to register, log in, manage playlist videos and profiles.

## Dependencies

- cors: ^2.8.5
- dotenv: ^16.4.5
- jsonwebtoken: ^9.0.2
- mongoose: ^8.2.0

## Installation and Usage

1. Clone this repository: `git clone https://github.com/CorralesK/TubeKidsBackend.git`.
2. Install the dependencies: `npm install`.
3. Configure environment variables as needed.
4. Start the server: `npm start`.

## Endpoints API

#### Users and Session
- **POST /users**: Register a new user.
- **POST /session**: Log in with existing credentials.

#### Playlists
- **POST /playlists**: Add a new playlist to an user.
- **PATCH /playlists**: Update details of a playlist.
- **DELETE /playlists**: Remove a playlist.
  
#### Videos
- **POST /videos**: Add a new video to the playlist.
- **PATCH /videos**: Update details of a video in the playlist.
- **DELETE /videos**: Remove a video from the playlist.
  
#### Profiles
- **POST /profiles**: Create a new profile.
- **PATCH /profiles**: Update details of a profile.
- **DELETE /profiles**: Delete a profile.
- **GET /profiles/pin**: Get the PIN of the current profile.

## License

This project is licensed under the MIT License.
