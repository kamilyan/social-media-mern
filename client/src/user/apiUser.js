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

export const updateUser = (userId, token, user, name) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: user,
  })
    .then((res) => {
      //update user in localstorage.
      if (typeof window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('jwt'))
        auth.user.name = name
        localStorage.setItem('jwt', JSON.stringify(auth))
      }
      return res.json()
    })
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
