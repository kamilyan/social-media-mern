export const createPost = (userId, token, post) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/posts/users/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: post,
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(err))
}

export const getPosts = () => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export const getPostById = (postId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export const getPostsByUser = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/posts/users/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export const removePost = (postId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
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

export const updatePost = (postId, token, post) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: post,
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(err))
}
