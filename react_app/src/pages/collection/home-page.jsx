import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class homePage extends Component {
  state = {
    sets: []
  };

  componentDidMount() {
    Promise.all([
      fetch(
        "https://lego-star-wars-tracker.herokuapp.com/collection/minifigs",
        {
          headers: {
            Authorization: "Bearer " + this.props.token
          }
        }
      ).then(value => value.json()),
      fetch("https://lego-star-wars-tracker.herokuapp.com/collection/sets", {
        headers: {
          Authorization: "Bearer " + this.props.token
        }
      }).then(value => value.json())
    ])
      .then(allResponses => {
        this.setState({
          figures: allResponses[0].figures,
          sets: allResponses[1].sets
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  filterSets = () => {
    let originalSets = this.state.sets;
    let filteredSets = [];
    let collection;
    let sort;

    if (window.location.search) {
      collection = window.location.search.split("=")[1];
    }
    if (window.location.hash) {
      sort = window.location.hash.split("=")[1];
    }

    if (collection) {
      if (filteredSets.length === 0) {
        filteredSets = originalSets.filter(set => {
          const searchableFilters = [];

          set.filters.forEach(filter => {
            const i = filter.replace(/\s+/g, "");

            searchableFilters.push(i);
          });

          if (searchableFilters.includes(collection)) {
            return set;
          }
          return null;
        });
      } else {
        filteredSets.filter(set => {
          if (set.filters.includes(collection)) {
            return set;
          }
          return null;
        });
      }
    }

    if (sort) {
      if (filteredSets.length === 0) {
        switch (sort) {
          case "SetNumber":
            originalSets.sort((a, b) => a.SetNumber - b.SetNumber);
            break;

          case "Name":
            let sortName = [];
            let temp = originalSets.map((set, index) => {
              return { index: index, name: set.name.toLowerCase() };
            });
            temp.sort((a, b) => {
              if (a.name > b.name) {
                return 1;
              }
              if (a.name < b.name) {
                return -1;
              }
              return 0;
            });
            sortName = temp.map(el => {
              return originalSets[el.index];
            });
            originalSets = sortName;
            break;

          case "YearReleased":
            originalSets.sort((a, b) => a.year - b.year);
            break;

          case "NumberofPieces":
            originalSets.sort((a, b) => a.pieceNumber - b.pieceNumber);
            break;

          case "NumberofMinifigures":
            originalSets.sort((a, b) => a.minifigNumber - b.minifigNumber);
            break;

          case "DateAdded":
            originalSets.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;

          case "New":
            let i = [];
            originalSets.forEach(set => {
              if (set.quality === "New") {
                i.unshift(set);
              }
              if (set.quality === "Used") {
                i.push(set);
              }
            });
            originalSets = i;
            break;

          case "Used":
            let x = [];
            originalSets.forEach(set => {
              if (set.quality === "New") {
                x.push(set);
              }
              if (set.quality === "Used") {
                x.unshift(set);
              }
            });
            originalSets = x;
            break;
          default:
        }
      } else {
        switch (sort) {
          case "SetNumber":
            filteredSets.sort((a, b) => a.SetNumber - b.SetNumber);
            break;

          case "Name":
            let newArray = [];
            let temp = filteredSets.map((set, index) => {
              return { index: index, name: set.name.toLowerCase() };
            });
            temp.sort((a, b) => {
              if (a.name > b.name) {
                return 1;
              }
              if (a.name < b.name) {
                return -1;
              }
              return 0;
            });
            newArray = temp.map(el => {
              return filteredSets[el.index];
            });
            filteredSets = newArray;
            break;

          case "YearReleased":
            filteredSets.sort((a, b) => a.year - b.year);
            break;

          case "NumberofPieces":
            filteredSets.sort((a, b) => a.pieceNumber - b.pieceNumber);
            break;

          case "NumberofMinifigures":
            filteredSets.sort((a, b) => a.minifigNumber - b.minifigNumber);
            break;

          case "DateAdded":
            filteredSets.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;

          case "New":
            let i = [];
            filteredSets.forEach(set => {
              if (set.quality === "New") {
                i.unshift(set);
              }
              if (set.quality === "Used") {
                i.push(set);
              }
            });
            filteredSets = i;
            break;

          case "Used":
            let x = [];
            filteredSets.forEach(set => {
              if (set.quality === "New") {
                x.push(set);
              }
              if (set.quality === "Used") {
                x.unshift(set);
              }
            });
            filteredSets = x;
            break;
          default:
        }
      }
    }

    return filteredSets.length === 0 && !collection
      ? originalSets.map((set, index) => {
          return (
            <Link
              className="set-item_container"
              to={{
                pathname: "/details",
                state: {
                  item: set,
                  sets: this.state.sets,
                  figures: this.state.figures,
                  token: this.props.token,
                  itemType: "set"
                }
              }}
              key={index}
            >
              <img className="set-item_image" src={set.images} alt="" />
              <h1>{set.name}</h1>
            </Link>
          );
        })
      : filteredSets.map((set, index) => {
          return (
            <Link
              className="set-item_container"
              to={{
                pathname: "/details",
                state: {
                  item: set,
                  sets: this.state.sets,
                  figures: this.state.figures,
                  token: this.props.token,
                  itemType: "set"
                }
              }}
              key={index}
            >
              <img className="set-item_image" src={set.images} alt="" />
              <h1>{set.name}</h1>
            </Link>
          );
        });
  };

  render() {
    return (
      <main className="sets-container">
        {this.state.sets && this.state.sets.length !== 0
          ? window.location.search || window.location.hash
            ? this.filterSets()
            : this.state.sets.map((set, index) => {
                return (
                  <Link
                    className="set-item_container"
                    to={{
                      pathname: "/details",
                      state: {
                        item: set,
                        sets: this.state.sets,
                        figures: this.state.figures,
                        token: this.props.token,
                        itemType: "set"
                      }
                    }}
                    key={index}
                  >
                    <img className="set-item_image" src={set.images} alt="" />
                    <h1>{set.name}</h1>
                  </Link>
                );
              })
          : null}
      </main>
    );
  }
}
