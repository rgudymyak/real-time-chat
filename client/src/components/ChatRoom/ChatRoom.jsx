import { Messages } from '../Messages/Messages'
import { Navbar } from '../Navbar/Navbar'
import { SendMessage } from '../SendMessage/SendMessage'
import s from './ChatRoom.module.css'

export const ChatRoom = ({ socket, username, chatOwner, room }) => {
  return (
    <div className={s.chatRoom}>
      <Navbar socket={socket} username={username} room={room} />

      <div>
        <Messages
          socket={socket}
          username={username}
          chatOwner={chatOwner}
          room={room}
        />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  )
}
