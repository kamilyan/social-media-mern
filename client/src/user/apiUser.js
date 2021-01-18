export const getUserProfile = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export const updateUser = (user, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/users/${user.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export const removeUser = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export const getUsers = () => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}
