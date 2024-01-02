# Roombeat

Roombeat is a collaborative music-sharing platform that allows users to listen to Spotify together in real-time within designated rooms. Users can control playback, view current song details, and manage rooms.

## Features

- **Spotify Authentication**: Users can authenticate their Spotify accounts to access the shared music room.
- **Real-time Playback Control**: Users within a room can control the playback of a shared Spotify account (play, pause, skip).
- **Room Creation and Joining**: Users can create rooms and share a unique room ID for others to join.
- **Room Dashboard**: Displays current song details, connected members, and playback controls.

## Future Developments

The following features are planned for future updates:

- **Permission-Based Controls**: Room owners can assign specific control permissions to room members for enhanced playback control.
- **Voting System**: Introduce a voting mechanism for skipping songs or making playback decisions within the room.
- **Queue Managed Playback**: Add queue based system to support more advanced operations, such as adding, reordering and song removal.

## Setup Instructions

1. **Clone the Repository**:
```bash
git clone https://github.com/BugReportOnWeb/roombeat.git
```

2. **Install Dependencies**:
- For the client:
  ```bash
  cd client
  npm install
  ```
- For the server:
  ```bash
  cd server
  npm install
  ```

3. **Environment Variables**:
- Create a `.env` file in the `/server` directory.
- Add the following variables to the `.env` file:
  ```plaintext
  CLIENT_PORT=5173
  SERVER_PORT=3000
  HOST=localhost

  SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID
  SPOTIFY_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET
  REDIRECT_URI=http://localhost:3000/api/spotify
  ```
- Replace `YOUR_SPOTIFY_CLIENT_ID` and `YOUR_SPOTIFY_CLIENT_SECRET` with your actual Spotify application client ID and client secret obtained from the Spotify Developer Dashboard.
- Ensure that the `REDIRECT_URI` matches the redirect URI specified in your Spotify application settings.

4. **Start the Application**:
- For the client:
  ```bash
  cd client
  npm run dev
  ```
- For the server:
  ```bash
  cd server
  npm run dev
  ```

After starting the server and client, the application can be accessed at [http://localhost:5173](http://localhost:5173).

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for any improvements or additional features.

## License

This project is licensed under the [GNU General Public License version 3.0](LICENSE.md).
