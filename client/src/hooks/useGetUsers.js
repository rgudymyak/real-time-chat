import { useEffect, useState } from 'react'
import { getUsers } from '../api/getUsers'

export const useGetUsers = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    getUsers().then((data) => setUsers(data))
  }, [])

  return { users }
}
