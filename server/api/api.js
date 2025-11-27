export const fetchingData = async () => {
  const data = await fetch(
    'https://hr2.sibers.com/test/frontend/users.json'
  ).then((data) => data.json())
  return data
}
