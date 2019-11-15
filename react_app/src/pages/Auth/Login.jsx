import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  state = {
    email: "",
    password: "",
    logInSignUp: "login"
  };

  inputChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  authMethodHandler = e => {
    e.preventDefault();
    if (e.target.name === "login") {
      this.props.onLogin(e, this.state);
    }
    if (e.target.name === "signup") {
      this.props.onSignup(e, this.state);
    }
  };

  render() {
    return (
      <React.Fragment>
        <form id="login-form">
          <div id="logo"></div>
          <div className="form-contents">
            <input
              id="email"
              label="Your E-Mail"
              type="email"
              name="email"
              onChange={this.inputChangeHandler}
              placeholder="E-mail"
            />
            <input
              id="password"
              label="Password"
              type="password"
              name="password"
              onChange={this.inputChangeHandler}
              placeholder="password"
            />
            <button
              id="form-contents_button-login"
              name="login"
              onClick={this.authMethodHandler}
              type="submit"
            >
              Login
            </button>
            <button
              id="form-contents_button-signin"
              name="signup"
              onClick={this.authMethodHandler}
              type="submit"
            >
              SignUp
            </button>
          </div>
        </form>
        {/* <Link to="/signup">Create an Account</Link> */}
      </React.Fragment>
    );
  }
}

export default Login;
