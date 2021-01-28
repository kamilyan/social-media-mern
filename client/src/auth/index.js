export const signup = (user) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(err))
}

export const signin = (user) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(err))
}

export const authenticate = (jwt, next) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(jwt))
    next()
  }
}

export const signout = (next) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt')
  }
  next()
  return fetch(`${process.env.REACT_APP_API_URL}/api/signout`, {
    method: 'GET',
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(err))
}

export const isAuthenticated = () => {
  if (typeof window == 'undefined') {
    return false
  }

  if (localStorage.getItem('jwt')) {
    return JSON.parse(localStorage.getItem('jwt'))
  } else {
    return false
  }
}

export const forgotPassword = (email) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/forgot-password/`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const resetPassword = (resetInfo) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/reset-password/`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resetInfo),
  })
    .then((response) => {
      console.log('forgot password response: ', response)
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const socialLogin = (user) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/social-login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
