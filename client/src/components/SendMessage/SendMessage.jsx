import { useState } from 'react'
import s from './SendMessage.module.css'

export const SendMessage = ({ socket, room, username }) => {
  const [message, setMessage] = useState('')

  const sendMessage = () => {
    if (message && room) {
      const __createdtime__ = Date.now()

      const messageData = {
        room,
        message,
        username,
        __createdtime__,
      }
      socket.emit('send_message', messageData)
      setMessage('')
    }
  }
  return (
    <div className={s.container}>
      <input
        className={s.msgInput}
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Введите сообщение...'
      />
      <button className={s.btn} onClick={sendMessage}>
        Отправить
      </button>
    </div>
  )
}
