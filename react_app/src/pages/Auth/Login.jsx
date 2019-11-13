import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  inputChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <form id="login-form" onSubmit={e => this.props.onLogin(e, this.state)}>
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
            <button type="submit">Login</button>
          </div>
        </form>
        {/* <Link to="/signup">Create an Account</Link> */}
      </React.Fragment>
    );
  }
}

export default Login;
