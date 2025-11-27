import { useEffect, useState } from 'react'
import s from './Messages.module.css'

export const Messages = ({ socket, room }) => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.on('receive_welcome_message', (data) => {
      setMessages((prevMsgs) => [...prevMsgs, data])
    })

    socket.on('receive_message', (data) => {
      setMessages((prevMsgs) => [
        ...prevMsgs,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ])
    })

    return () => {
      socket.off('receive_message')
      socket.off('receive_welcome_message')
    }
  }, [socket])

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  return (
    <div className={s.container}>
      <h3>Комната: {room}</h3>
      <div className={''}>
        {messages.map((msg) => (
          <div className={s.msgContainer}>
            <div
              key={`${msg.__createdtime__}${msg.username}`}
              className={s.messagesList}
            >
              <span>{msg.username}</span>
              <span>{formatDate(msg.__createdtime__)}</span>
            </div>
            <p className={s.msg}>{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
