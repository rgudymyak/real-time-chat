import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import io from 'socket.io-client'
import './App.css'
import { ChatRoom } from './components/ChatRoom/ChatRoom'
import { WelcomePage } from './components/WelcomePage/WelcomePage'
import { useGetUsers } from './hooks/useGetUsers'

const socket = io.connect('http://localhost:4000')

function App() {
  const [room, setRoom] = useState('')
  const [chatOwner] = useState(true)
  const [username, setUsername] = useState('')

  const users = useGetUsers()

  return (
    <Routes>
      <Route
        path={'/'}
        element={
          <WelcomePage
            users={users}
            room={room}
            username={username}
            setUsername={setUsername}
            setRoom={setRoom}
            socket={socket}
            chatOwner={chatOwner}
          />
        }
      />
      <Route
        path={'/chat'}
        element={
          <ChatRoom
            socket={socket}
            username={username}
            room={room}
            chatOwner={chatOwner}
          />
        }
      />
    </Routes>
  )
}

export default App
