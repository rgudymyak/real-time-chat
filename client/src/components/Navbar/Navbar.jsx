import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Navbar.module.css'

export const Navbar = ({ socket, username, room }) => {
  const [participants, setParticipants] = useState([])

  const [creatorId, setCreatorId] = useState(null)

  const navigate = useNavigate()

  const isCurrentUserCreator = socket.id === creatorId

  useEffect(() => {
    socket.on('update_room_info', ({ participants, creatorId }) => {
      setParticipants(participants)
      setCreatorId(creatorId)
    })

    socket.on('kicked_from_room', (room) => {
      navigate('/')

      alert(`Вы были удалени из комнаты ${room}`)
    })

    return () => {
      socket.off('kicked_from_room')
      socket.off('update_room_info')
    }
  }, [socket])

  useEffect(() => {
    const __createdtime__ = Date.now()
    socket.emit('join_room', { username, room, __createdtime__ })
  }, [])

  const kickUser = (targetUserId) => {
    const __createdtime__ = new Date()
    if (isCurrentUserCreator) {
      socket.emit('kick_user', {
        room,
        username,
        __createdtime__,
        targetUserId,
      })
    } else {
      alert('У вас нет прав на удаление пользователей.')
    }
  }

  const leaveRoom = () => {
    const __createdtime__ = Date.now()

    socket.emit('leave_room', { username, room, __createdtime__ })
    navigate('/')
  }

  return (
    <div>
      <div className={s.container}>
        <h3>Пользователи в комнате:</h3>
        <div className={s.navbar}>
          {participants.map((participant) => {
            return (
              <div
                className={s.pContainer}
                key={`${participant.username} + ${participant.id}`}
              >
                <span>{participant.username}</span>
                {isCurrentUserCreator && socket.id !== participant.id && (
                  <button
                    onClick={() => kickUser(participant.id)}
                    className={s.btnX}
                  >
                    X
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <button className={s.btn} onClick={leaveRoom}>
        Выйти из комнаты
      </button>
    </div>
  )
}
