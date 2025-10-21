import React, { useState } from 'react'
import './LoginSignup.css'

import user_icon from '../../assets/icons/person.png'
import email_icon from '../../assets/icons/mail.png'
import password_icon from '../../assets/icons/password.png'

const LoginSignup = () => {
    const [action, setAction] = useState("Sign Up");

    return (
    <div className='container'>
        <div className='header'>
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            {action === "Sign Up" && (
              <div className="input">
                  <img src={user_icon} alt="" />
                  <input type="text" placeholder="Name" />
              </div>
            )}
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" placeholder="E-mail"/>
            </div>
            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" placeholder="Password" />
            </div>
        </div>
        {action === "Login" && (
          <div className="forgot-password">
            Lost Password? 
            <span>Click Here!</span>
            </div>
        )}
                <div className="submit-container">
                        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>
                        Sign Up
                        </div>
                        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>
                        Login
                        </div>
                </div>
    </div>
  )
}

export default LoginSignup