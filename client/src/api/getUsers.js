export const getUsers = async () => {
  const data = await fetch(
    'https://hr2.sibers.com/test/frontend/users.json'
  ).then((res) => res.json())
  return data
}
