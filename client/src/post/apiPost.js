export const createPost = (userId, token, post) => {
  return fetch(`/api/posts/users/${userId}`, {
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
  return fetch(`/api/posts`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export const getPostById = (postId) => {
  return fetch(`/api/posts/${postId}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export const getPostsByUser = (userId, token) => {
  return fetch(`/api/posts/users/${userId}`, {
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
  return fetch(`/api/posts/${postId}`, {
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
  return fetch(`/api/posts/${postId}`, {
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

export const performLike = (postId, token) => {
  return fetch(`/api/posts/${postId}/like`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(err))
}

export const performUnlike = (postId, token) => {
  return fetch(`/api/posts/${postId}/unlike`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(err))
}

export const performComment = (postId, token, comment) => {
  return fetch(`/api/posts/${postId}/comment`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment }),
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(err))
}

export const performUncomment = (postId, token, comment) => {
  return fetch(`/api/posts/${postId}/uncomment`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment }),
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(err))
}
