import React, { Component } from "react";
import { Link } from "react-router-dom";

import { ProductConsumer } from "../context";

export default class filterNav extends Component {
  state = {
    selectedCollection: "All",
    selectedSort: "",
    currentPage: window.location.href,
    sortFilters: [
      {
        theme: "sets",
        filter: "Set Number",
        clicked: false
      },
      {
        theme: "sets",
        filter: "Name",
        clicked: false
      },
      {
        theme: "sets",
        filter: "Year Released",
        clicked: false
      },
      {
        theme: "sets",
        filter: "Number of Pieces",
        clicked: false
      },
      {
        theme: "sets",
        filter: "Number of Minifigures",
        clicked: false
      },
      {
        theme: "sets",
        filter: "Date Added",
        clicked: false
      },
      {
        theme: "sets",
        filter: "New",
        clicked: false
      },
      {
        theme: "sets",
        filter: "Used",
        clicked: false
      }
    ],
    filters: [
      "All",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "Rogue One",
      "Solo",
      "Clone Wars",
      "Rebels",
      "Freemakers",
      "Resistance",
      "The Mandalorian",
      "Battlefront",
      "Old Republic",
      "Legends",
      "Ultimate Collec..",
      "Microfighters",
      "Polybags",
      "Limited Edition",
      "20th Anniversary"
    ]
  };

  handleSelectedLink = e => {
    this.setState({
      selectedCollection: e.target.name
    });
  };
  handleSelectedSort = e => {
    this.setState({
      selectedSort: e.target.name
    });
  };
  resetSort = () => {
    this.setState({
      selectedSort: ""
    });
  };

  render() {
    return (
      <ProductConsumer>
        {value => {
          return (
            <nav id="nav-filter">
              <ul
                className={
                  value.sortByToggle ? "sort-by-nav open" : "sort-by-nav closed"
                }
              >
                {this.state.sortFilters.map((f, index) => {
                  let str = f.filter.replace(/\s+/g, "");
                  return (
                    <li key={index}>
                      <Link
                        className={
                          this.state.selectedSort === f.filter
                            ? "selectedSort"
                            : null
                        }
                        to={
                          window.location.search &&
                          window.location.pathname === "/"
                            ? `/${window.location.search + "#sort=" + str}`
                            : !window.location.search &&
                              window.location.pathname === "/"
                            ? `/#sort=${str}`
                            : window.location.search &&
                              window.location.pathname === "/minifigs"
                            ? `/minifigs${window.location.search +
                                "#sort=" +
                                str}`
                            : !window.location.search &&
                              window.location.pathname === "/minifigs"
                            ? `/minifigs#sort=${str}`
                            : null
                        }
                        name={f.filter}
                        onClick={e => {
                          value.sortToggle();
                          this.handleSelectedSort(e);
                        }}
                      >
                        {f.filter}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <ul id="collection-nav">
                {this.state.filters.map((filter, index) => {
                  let str = filter.replace(/\s+/g, "");

                  return (
                    <li key={index}>
                      <Link
                        name={filter}
                        onClick={e => {
                          if (filter === "All") {
                            value.resetToggle();
                            this.resetSort();
                          }

                          this.handleSelectedLink(e);
                        }}
                        to={
                          filter === "All" && window.location.pathname === "/"
                            ? "/"
                            : filter === "All" &&
                              window.location.pathname === "/minifigs"
                            ? "/minifigs"
                            : window.location.hash &&
                              window.location.pathname === "/"
                            ? `/${"?collection=" + str + window.location.hash}`
                            : !window.location.hash &&
                              window.location.pathname === "/"
                            ? `/?collection=${str}`
                            : window.location.hash &&
                              window.location.pathname === "/minifigs"
                            ? `/minifigs${"?collection=" +
                                str +
                                window.location.hash}`
                            : !window.location.hash &&
                              window.location.pathname === "/minifigs"
                            ? `/minifigs?collection=${str}`
                            : null
                        }
                        className={
                          this.state.selectedCollection === filter
                            ? "selectedLink"
                            : null
                        }
                      >
                        {filter}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          );
        }}
      </ProductConsumer>
    );
  }
}
