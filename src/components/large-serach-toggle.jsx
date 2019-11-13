import React, { Component } from "react";
import { Link } from "react-router-dom";

import { ProductConsumer } from "../context";

export default class largeSerachToggle extends Component {
  state = {
    toggleClicked: false
  };

  toggleHandler = () => {
    this.setState(prevState => {
      return {
        toggleClicked: !prevState.toggleClicked
      };
    });
  };
  render() {
    return (
      <ProductConsumer>
        {value => {
          return (
            <section id="home-search-toggle">
              <Link
                id="set-search"
                to={{
                  pathname: "/search",
                  state: {
                    itemType: window.location.pathname,
                    token: this.props.token
                  }
                }}
              >
                {window.location.pathname === "/"
                  ? "Search for Set"
                  : "Search for Figure"}
              </Link>

              <div
                className={
                  value.sortByToggle ? "sort-toggle on" : "sort-toggle off"
                }
                onClick={() => {
                  this.toggleHandler();
                  value.sortToggle();
                }}
              >
                <p id="sort-toggle_name">Sort</p>
              </div>
            </section>
          );
        }}
      </ProductConsumer>
    );
  }
}
