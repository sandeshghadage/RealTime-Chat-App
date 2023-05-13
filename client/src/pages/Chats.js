import { AiOutlineSend } from "react-icons/ai";
import { useEffect, useState } from "react";
import style from "./Chat.module.css";

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
      <div className={style.chatbody}>
        {messageList.map((contents) => {
          return (
            <div
              key={contents.time}
              className={style.message}
              id={userName === contents.user ? "you" : "other"}
            >
              <span className={style.message_content}>
                <p>{contents.message}</p>
              </span>
              <span className={style.message_meta}>
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
