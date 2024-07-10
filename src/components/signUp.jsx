import React, { useState } from "react";
import axios from "axios";

import DatePicker from "./DatePicker";


const Signup = ({ onRegister }) => {


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(false);
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); // State to track registration status

  const validateUsername = (username) => {
    const usernameLengthValid = username.length >= 8 && username.length <= 20;
    const usernameCharsValid = /^[A-Za-z0-9]+$/.test(username);
    setIsUsernameValid(usernameLengthValid && usernameCharsValid);
  };

  const validatePassword = (password) => {
    const passwordLengthValid = password.length >= 8 && password.length <= 20;
    const passwordNumberOrSpecialValid = /[0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password);
    const passwordUppercaseValid = /[A-Z]/.test(password);
    const passwordNoSeqValid = !/(.)\1{2,}|012|123|234|345|456|567|678|789/.test(password);
    setIsPasswordValid(passwordLengthValid && passwordNumberOrSpecialValid && passwordUppercaseValid && passwordNoSeqValid);
  };

  const validateEmail = (email) => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsEmailValid(emailValid);
  };

  const validateMobileNumber = (mobileNumber) => {
    const mobileNumberValid = /^[0-9]{10}$/.test(mobileNumber);
    setIsMobileNumberValid(mobileNumberValid);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isConfirmPasswordValid = password === confirmPassword;
    setIsConfirmPasswordValid(isConfirmPasswordValid);

    if (isUsernameValid && isPasswordValid && isConfirmPasswordValid && isEmailValid && isMobileNumberValid) {
      try {
        console.log("API Call: /api/auth/signup");
        await axios.post("http://localhost:5050/api/auth/signup", {
          username,
          password,
          email,
          mobileNumber,
        });
        setMessage("User registered successfully!");
        setIsRegistered(true); // Set registration status to true
        onRegister(); // Notify parent component of registration
      } catch (error) {
        console.error("Error registering user:", error);
        setMessage("Error registering user: " + (error.response?.data?.message || error.message));
      }
    } else {
      setMessage("Please fill out all fields correctly.");
    }
  };

  // Render signup form if not registered, otherwise render message and login form
  return (

    <div className="containe">

      {!isRegistered ? (
        <>
        <div className="container" >
      <div className="card col-8 mx-auto" >
        <div className="card-body">
          <h5 className="card-title">PersonalASDFGHJK Details</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">
            Tell us about yourself
          </h6>
          <hr />
          <form>
            <div className="input-group mb-3" >
              <span className="input-group-text">First and last name</span>
              <input
                type="text"
                aria-label="First name"
                className="form-control"
                required

              />
              <input
                type="text"
                aria-label="Last name"
                className="form-control"
                required

              />
            </div>
            <DatePicker />
          </form>
        </div>
      </div>
    </div>
          <h2>Create your login details</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="label-text" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUsername(e.target.value);
                }}
                required
                placeholder="Enter your username"
                className={isUsernameValid ? "valid-input" : ""}
              />
              <ul id="usernameRequirements">
                <li className={username.length >= 8 && username.length <= 20 ? "valid" : ""}>Must be 8-20 characters long.</li>
                <li className={/^[A-Za-z0-9]+$/.test(username) ? "valid" : ""}>Must not contain any special characters or spaces.</li>
              </ul>
            </div>

            <div className="input-group">
              <label className="label-text" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
                placeholder="Enter your password"
                className={isPasswordValid ? "valid-input" : ""}
              />
              <ul id="passwordRequirements">
                <li className={password.length >= 8 && password.length <= 20 ? "valid" : ""}>Must be 8-20 characters long.</li>
                <li className={/[0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password) ? "valid" : ""}>Contain at least 1 number or special character.</li>
                <li className={/[A-Z]/.test(password) ? "valid" : ""}>Contain at least 1 UPPER case letter.</li>
                <li className={!/(.)\1{2,}|012|123|234|345|456|567|678|789/.test(password) ? "valid" : ""}>Not contain sequences or repeated characters.</li>
              </ul>
            </div>

            <div className="input-group">
              <label className="label-text" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className={isConfirmPasswordValid ? "valid-input" : ""}
              />
              {!isConfirmPasswordValid && <p id="passwordMismatch">Passwords do not match.</p>}
            </div>

            <div className="input-group">
              <label className="label-text" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                required
                placeholder="Enter your email"
                className={isEmailValid ? "valid-input" : ""}
              />
              {!isEmailValid && email.length > 0 && <p id="emailInvalid">Invalid email address.</p>}
            </div>

            <div className="input-group">
              <label className="label-text" htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  validateMobileNumber(e.target.value);
                }}
                required
                placeholder="Enter your mobile number"
                className={isMobileNumberValid ? "valid-input" : ""}
              />
              {!isMobileNumberValid && mobileNumber.length > 0 && <p id="mobileNumberInvalid">Invalid mobile number.</p>}
            </div>

            <button
              type="submit"
              className="button"
              disabled={
                !isUsernameValid ||
                !isPasswordValid ||
                !isConfirmPasswordValid ||
                !isEmailValid ||
                !isMobileNumberValid
              }
            >
              Register
            </button>
          </form>
          {message && <p>{message}</p>}
        </>
      ) : (
        <>
          <p className="success-message">{message}</p>
        </>
      )}
    </div>
  );
};

export default Signup;
