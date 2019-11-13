import React, { Component } from "react";

import BackLink from "../../components/back-link";

export default class SignOut extends Component {
  render() {
    return (
      <React.Fragment>
        <BackLink />
        <div id="signout-button" onClick={this.props.signout}>
          <h1>Sign Out</h1>
        </div>
      </React.Fragment>
    );
  }
}
