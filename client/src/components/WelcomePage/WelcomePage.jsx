import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './WelcomePage.module.css'

const getUserIdByUsername = (username, users) => {
  const user = users.find((user) => user.name === username)
  return user ? user.id : undefined
}

export const WelcomePage = ({
  users,
  username,
  setUsername,
  room,
  setRoom,
  socket,
}) => {
  const [occupiedUserIds, setOccupiedUserIds] = useState(new Set())
  const isSelectedUserOccupied =
    username && occupiedUserIds.has(getUserIdByUsername(username, users.users))

  useEffect(() => {
    socket.on('occupied_users_ids', (occupiedIdsArray) => {
      setOccupiedUserIds(new Set(occupiedIdsArray))
    })

    return () => {
      socket.off('occupied_users_ids')
    }
  }, [])

  const availableUsers = users.users.filter(
    (user) => !occupiedUserIds.has(user.id)
  )
  const navigate = useNavigate()

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      navigate('/chat')
    }
  }
  return (
    <div className={s.container}>
      <div className={s.formContainer}>
        <h3>Выберите пользователя и чат </h3>

        <select
          className={s.input}
          onChange={(e) => setUsername(e.target.value)}
        >
          <option value=''>Выберите пользователя</option>

          {availableUsers.map((user) => {
            return (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            )
          })}
        </select>
        {username && !availableUsers.some((u) => u.name === username) && (
          <p style={{ color: 'red' }}>Этот пользователь уже занят!</p>
        )}

        <input
          className={s.input}
          type='text'
          placeholder='Название комнаты...'
          onChange={(e) => setRoom(e.target.value)}
        />
        <button
          className={s.btn}
          onClick={joinRoom}
          disabled={!username || isSelectedUserOccupied}
        >
          Присоединиться
        </button>
      </div>
    </div>
  )
}
