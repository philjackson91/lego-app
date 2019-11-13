import React, { Component } from "react";

export default class Signup extends Component {
  state = {
    email: "",
    password: ""
  };

  inputChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <form id="login-form" onSubmit={e => this.props.onSignup(e, this.state)}>
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
          <button type="submit">Sign Up</button>
        </div>
      </form>
    );
  }
}
