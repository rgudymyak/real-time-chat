import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { fetchingData } from './api/api.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

const PORT = 4000
const roomsState = {}

const users = await fetchingData()

const occupiedUsersIds = new Set()

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id != userID)
}
// users.map((user) => console.log(user))
io.on('connection', (socket) => {
  console.log('Новый пользователь подключился', socket.id)

  socket.on('join_room', (data) => {
    const { username, room, __createdtime__ } = data

    socket.join(room)
    const user = users.find((user) => user.name === username)

    if (user) {
      occupiedUsersIds.add(user.id)
    }

    io.emit('occupied_users_ids', Array.from(occupiedUsersIds))

    socket.emit('receive_welcome_message', {
      message: `Welcome to the chat room, ${username}`,
      username,
      __createdtime__,
    })

    socket.to(room).emit('receive_message', {
      message: `${username} has connected to the room`,
      username,
      __createdtime__,
    })

    if (!roomsState[room]) {
      roomsState[room] = { creatorId: socket.id, participants: [] }
    }

    const userExists = roomsState[room].participants.some(
      (p) => p.id === socket.id
    )

    if (!userExists) {
      roomsState[room].participants.push({ id: socket.id, username: username })
    }

    io.to(room).emit('update_room_info', {
      participants: roomsState[room].participants,
      creatorId: roomsState[room].creatorId,
    })
  })

  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data)
  })

  socket.on('kick_user', ({ room, targetUserId }) => {
    const roomInfo = roomsState[room]

    if (roomInfo && roomInfo.creatorId === socket.id) {
      const targetSocket = io.sockets.sockets.get(targetUserId)
      if (targetSocket) {
        targetSocket.leave(room)
        targetSocket.emit('kicked_from_room', room)
      }

      roomsState[room].participants = roomsState[room].participants.filter(
        (participant) => participant.id !== targetSocket.id
      )

      if (roomsState[room].participants.length === 0) {
        delete roomsState[room]
      } else {
        io.to(room).emit('update_room_info', {
          participants: roomsState[room].participants,
          creatorId: roomsState[room].creatorId,
        })
      }
    }
  })

  socket.on('leave_room', ({ username, room, __createdtime__ }) => {
    socket.leave(room)
    roomsState[room].participants = leaveRoom(
      socket.id,
      roomsState[room].participants
    )
    socket.to(room).emit('room_users', roomsState[room].participants)
    socket.to(room).emit('receive_message', {
      username,
      message: `${username} leave the room ${room}`,
      __createdtime__,
    })
  })
})
