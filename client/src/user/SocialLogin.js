import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import { socialLogin, authenticate } from '../auth'

class SocialLogin extends Component {
  constructor() {
    super()
    this.state = {
      redirectToReferrer: false,
    }
  }

  responseGoogle = (response) => {
    const { googleId, name, email, imageUrl } = response.profileObj
    const user = {
      password: googleId,
      name: name,
      email: email,
      imageUrl: imageUrl,
    }
    socialLogin(user).then((data) => {
      if (data && data.error) {
        console.log('Error Login. Please try again..')
      } else {
        authenticate(data, () => {
          this.setState({ redirectToReferrer: true })
        })
      }
    })
  }

  render() {
    const { redirectToReferrer } = this.state
    if (redirectToReferrer) {
      return <Redirect to='/' />
    }

    return (
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText='Login with Google'
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
      />
    )
  }
}

export default SocialLogin
