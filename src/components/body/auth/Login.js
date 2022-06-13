import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { dispatchLogin } from '../../../redux/actions/authAction'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';


const initialState = {
    email: '',
    password: '',
    err: '',
    success: ''
}

function Login() {
    const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()

    const { email, password, err, success } = user

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value, err: '', success: '' })
    }


    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/auth/login', { email, password })
            setUser({ ...user, err: '', success: res.data.msg })

            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push("/")

        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }

    const responseGoogleLogin = async (response) => {
        try {
            const res = await axios.post('/api/auth/google-login', { tokenId: response.tokenId })

            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push('/')
        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }


    const responseGoogleSignup = async (response) => {
        try {
            const res = await axios.post('/api/auth/google-signup', { tokenId: response.tokenId })

            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push('/')
        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }




    const responseFacebookLogin = async (response) => {
        try {
            const { accessToken, userID } = response
            const res = await axios.post('/api/auth/facebook-login', { accessToken, userID })

            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push('/')
        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }


    
    const responseFacebookSignup = async (response) => {
        try {
            const { accessToken, userID } = response
            const res = await axios.post('/api/auth/facebook-signup', { accessToken, userID })

            setUser({ ...user, error: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push('/')
        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }
    return (

        <div className="login_page">


            <h2>Login</h2>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="text" placeholder="Enter email address" id="email"
                        value={email} name="email" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Enter password" id="password"
                        value={password} name="password" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <button type="submit">Login</button>
                    <Link to="/forgot_password">Forgot your password?</Link>
                </div>
            </form>

            <div className="hr">Or Login With</div>

            <div className="social">
                <GoogleLogin
                    clientId="529281166411-hm3rnlkvu96q8ahu2pvtehega296vldg.apps.googleusercontent.com"
                    buttonText="Login with google"
                    onSuccess={responseGoogleLogin}
                    cookiePolicy={'single_host_origin'}
                />

                <GoogleLogin
                    clientId="529281166411-hm3rnlkvu96q8ahu2pvtehega296vldg.apps.googleusercontent.com"
                    buttonText="Signup with google"
                    onSuccess={responseGoogleSignup}
                    cookiePolicy={'single_host_origin'}
                />

                <FacebookLogin
                    appId="5025063474208012"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebookLogin}
                />
                
                <FacebookLogin
                    appId="5025063474208012"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={responseFacebookSignup
                    }
                />
            </div>

            <p>New Customer? <Link to="/register">Register</Link></p>
        </div>
    )
}

export default Login
