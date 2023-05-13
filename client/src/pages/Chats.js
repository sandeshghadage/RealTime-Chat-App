import { AiOutlineSend } from "react-icons/ai";
import { useEffect, useState } from "react";

function Chats({ socket, userName, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        user: userName,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div>
      <div>
        <p>Live chat</p>
      </div>
      <div className="chat-body">
        {messageList.map((contents) => {
          return (
            <div
              key={contents.time}
              className="message"
              id={userName === contents.user ? "you" : "other"}
            >
              <span className="message-content">
                <p>{contents.message}</p>
              </span>
              <span className="message-meta">
                <p>{contents.user}</p>
                <p>{contents.time}</p>
              </span>
            </div>
          );
        })}
      </div>
      <div>
        <input
          type="text"
          placeholder="Type a message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>
          <AiOutlineSend />
        </button>
      </div>
    </div>
  );
}

export default Chats;
