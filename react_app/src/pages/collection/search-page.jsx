import React, { Component } from "react";
import { Link } from "react-router-dom";

import BackLink from "../../components/back-link";

export default class searchPage extends Component {
  state = {
    searchtype: this.props.location.state.itemType
  };

  componentDidMount() {
    if (this.state.searchtype === "/") {
      Promise.all([
        fetch(
          "https://lego-star-wars-tracker.herokuapp.com/collection/previousSearches",
          {
            headers: {
              Authorization: "Bearer " + this.props.location.state.token
            }
          }
        ).then(value => value.json()),
        fetch("https://lego-star-wars-tracker.herokuapp.com/collection/sets", {
          headers: {
            Authorization: "Bearer " + this.props.location.state.token
          }
        }).then(value => value.json())
      ])
        .then(allResponses => {
          let searches = [];
          let sets = [];
          let setIds = [];
          allResponses[0].searches.forEach(search => {
            let i = search.query.toLowerCase();
            search.query = i;
            searches.push(search);
          });
          allResponses[1].sets.forEach(set => {
            let i = set.name.toLowerCase();
            set.name = i;
            sets.push(set);
          });
          let sortArray = searches.reverse();
          this.setState({
            setIds: setIds,
            sets: sets,
            previousSearches: sortArray,
            shortenedPrevSearches: sortArray.slice(0, 5)
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Promise.all([
        fetch(
          "https://lego-star-wars-tracker.herokuapp.com/collection/previousSearches",
          {
            headers: {
              Authorization: "Bearer " + this.props.location.state.token
            }
          }
        ).then(value => value.json()),
        fetch(
          "https://lego-star-wars-tracker.herokuapp.com/collection/minifigs",
          {
            headers: {
              Authorization: "Bearer " + this.props.location.state.token
            }
          }
        ).then(value => value.json())
      ])
        .then(allResponses => {
          let searches = [];
          let figures = [];
          let setIds = [];
          allResponses[0].searches.forEach(search => {
            let i = search.query.toLowerCase();
            search.query = i;
            searches.push(search);
          });
          allResponses[1].figures.forEach(figure => {
            let i = figure.name.toLowerCase();
            figure.name = i;
            figures.push(figure);
          });
          let sortArray = searches.reverse();
          this.setState({
            setIds: setIds,
            figures: figures,
            previousSearches: sortArray,
            shortenedPrevSearches: sortArray.slice(0, 5)
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  addNewSearch = e => {
    e.preventDefault();

    // if (this.state.query !== "") {

    //   fetch("http://localhost:8080/collection/addNewSearchQuery", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + this.props.location.state.token
    //     },
    //     body: JSON.stringify({
    //       query: this.state.query
    //     })
    //   });
    // }
  };

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value.toLowerCase() });
  };

  removeInputHandler = () => {
    this.setState({ query: "" });
  };

  render() {
    let searchResults;
    let filteredsearches;

    if (this.state.query) {
      if (this.state.searchtype === "/") {
        if (/\d/.test(this.state.query)) {
          let stringMatches = this.state.query.match(/\d+/g);
          let setNumberMatches = [];

          this.state.sets.forEach(set => {
            stringMatches.forEach(number => {
              if (set.SetNumber.toString().includes(number)) {
                setNumberMatches.push(set);
              }
            });
          });

          searchResults = setNumberMatches;
        } else {
          searchResults = this.state.sets.filter(set => {
            return set.name.includes(this.state.query);
          });
        }

        if (this.state.previousSearches) {
          filteredsearches = this.state.previousSearches.filter(searches => {
            return searches.query.includes(this.state.query);
          });
          for (let search of filteredsearches) {
            if (!searchResults.includes(search.query)) {
              searchResults.push(search);
            }
          }
        }
      }

      if (this.state.searchtype === "/minifigs") {
        if (/\d/.test(this.state.query)) {
          let stringMatches = this.state.query.match(/\d+/g);
          let setNumberMatches = [];

          this.state.figures.forEach(figure => {
            stringMatches.forEach(number => {
              if (figure.SetNumber.toString().includes(number)) {
                setNumberMatches.push(figure);
              }
            });
          });

          searchResults = setNumberMatches;
        } else {
          searchResults = this.state.figures.filter(figure => {
            return figure.name.includes(this.state.query);
          });
        }

        if (this.state.previousSearches) {
          filteredsearches = this.state.previousSearches.filter(searches => {
            return searches.query.includes(this.state.query);
          });
          for (let search of filteredsearches) {
            if (!searchResults.includes(search.query)) {
              searchResults.push(search);
            }
          }
        }
      }
    }

    return (
      <React.Fragment>
        <form id="search-bar" onSubmit={this.addNewSearch}>
          <BackLink />
          <input
            type="text"
            onChange={this.changeHandler}
            name="query"
            id="query"
            autoFocus
            placeholder="Search for set"
            value={this.state.query ? this.state.query : ""}
          />
          {this.state.query ? (
            <button
              id="search-bar_close"
              onClick={this.removeInputHandler}
            ></button>
          ) : (
            <button id="search-bar_search" type="submit"></button>
          )}
        </form>
        <div id="search-results">
          {this.state.previousSearches && !this.state.query ? (
            <React.Fragment>
              <ul id="previous-search_container">
                {this.state.shortenedPrevSearches.map(search => {
                  let str = search.query.replace(/\s+/g, "");
                  return (
                    <li className="previos-search_item" key={search._id}>
                      <Link to={`/?=${str}`}>{search.query}</Link>
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
          ) : this.state.query && searchResults && searchResults.length > 0 ? (
            searchResults.map((i, index) => {
              return (
                <div className="search-result_container">
                  <figure>
                    <img src={i.images} alt="" />
                  </figure>
                  <Link
                    id="search-result"
                    key={index}
                    to={{
                      pathname: "/details",
                      state: {
                        item: i,
                        sets: this.state.sets,
                        figures: this.state.figures,
                        token: this.props.location.state.token,
                        itemType: this.props.location.state.itemType
                      }
                    }}
                  >
                    <div className="search-result_item-container">
                      <div className="search-result_item-name">
                        {i.query || i.name}
                      </div>

                      <div className="search-result_item-setNumber">
                        {i.SetNumber}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}
