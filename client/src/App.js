import { useState } from "react";
import io from "socket.io-client";
import Chats from "./pages/Chats";
import "./App.css";

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [isShowChat, setIsShowChat] = useState(false);

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setIsShowChat(true);
    }
  };
  return (
    <div className="App">
      {isShowChat ? (
        <Chats socket={socket} userName={userName} room={room} />
      ) : (
        <div className="MainDiv">
          <div className="Container">
            <span>
              <h1>Join Chat</h1>
            </span>
            <span className="Div">
              <input
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Room ID...."
                onChange={(e) => setRoom(e.target.value)}
              />
            </span>
            <span>
              <button className="join__btn" onClick={joinRoom}>
                Join Room
              </button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
