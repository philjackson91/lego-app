import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class backLink extends Component {
  backHandler = () => {
    this.props.history.goBack();
  };
  render() {
    return (
      <div className="back-link" onClick={this.backHandler}>
        back
      </div>
    );
  }
}

export default withRouter(backLink);
