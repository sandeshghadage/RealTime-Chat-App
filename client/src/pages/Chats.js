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
    <div className={style.chat__page}>
      <div className={style.chat__container}>
        <div className={style.roomDescriptionBox}>
          <h3>Live chat</h3>
        </div>
        <div className={style.chatbody}>
          {messageList.map((contents) => {
            return (
              <div
                key={contents.time}
                className={style.msg}
                id={userName === contents.user ? "you" : "other"}
              >
                <div id={style.userName}>{contents.user}</div>
                <div className={style.message_content}>
                  {contents.message}
                  <small>{contents.time}</small>
                </div>
              </div>
            );
          })}
        </div>
        <div className={style.inputBox}>
          <input
            type="text"
            placeholder="Type a message"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(event) => event.key === "Enter" && sendMessage()}
          />
          <div id={style.sendBtn} onClick={sendMessage}>
            <AiOutlineSend style={{ fontSize: "2rem" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;
