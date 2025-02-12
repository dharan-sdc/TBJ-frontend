import { useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { useState } from 'react'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'

export default function SignUp() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!fullName) {
      setError("Please enter your name!")
      return
    }
    if (!validateEmail(email)) {
      setError("Please Enter a valid email address!")
      return
    }
    if (!password) {
      setError("Please Enter a password!")
      return
    }
    setError("")
    //login api call
    try {
      const response = await axiosInstance.post('/create-account', {
        fullName: fullName,
        email: email,
        password: password
      })
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-cyan-50 overflow-hidden relative flex items-center justify-center md:py-20 py-10">

      <div className='hidden md:block login-ui-box right-10 -top-40' />
      <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2' />

      <div className="container flex flex-col md:flex-row items-center justify-center px-5 sm:px-10 md:px-20 mx-auto md:my-0 my-8">
        <div className="w-full sm:w-3/4 md:w-[50%] h-[85vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50 max-w-[720px] max-h-[1080px] bg-no-repeat">
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Join the <br /> Adventure
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Create an account to start documenting your travels and preserving your memories in your personal travel journal.
            </p>
          </div>
        </div>

        <div className="form-container w-full sm:w-4/5 md:w-[30%] h-[75vh] bg-white rounded-r-lg relative p-10 sm:p-16 shadow-lg shadow-cyan-200/20 mt-10 md:mt-0">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">Sign Up</h4>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={({ target }) => { setFullName(target.value) }}
              className="input-box w-full mb-4" />

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={({ target }) => { setEmail(target.value) }}
              className="input-box w-full mb-4" />

            <PasswordInput
              value={password}
              onChange={({ target }) => { setPassword(target.value) }}
              className="w-full mb-4"
            />
            {error && <p className='text-red-500 pb-1'>{error}</p>}
            <button type="submit" className="btn-primary w-full py-3 mb-4">
              CREATE ACCOUNT
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="button"
              className="btn-primary btn-light w-full py-3"
              onClick={() => {
                navigate("/login")
              }}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
