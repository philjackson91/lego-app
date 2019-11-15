import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import firebase from "../../config/firebase";
import "firebase/firestore";

import BackLink from "../../components/back-link";

export default class addSetPage extends Component {
  state = {
    name: "",
    setNumber: null,
    pieceNumber: null,
    quality: "",
    minifigNumber: null,
    filters: [],
    description: "",
    included: "",
    filterChecks: [
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
    ],
    checkedItems: new Map(),
    setOrMinifig: "set",
    redirectToHome: false
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleChange = e => {
    switch (e.target.name) {
      case "filters":
        const item = e.target.id;
        const isChecked = e.target.checked;
        this.setState(prevState => ({
          checkedItems: prevState.checkedItems.set(item, isChecked)
        }));
        break;
      case "images":
        this.setState({
          images: e.target.files[0],
          imagePreview: URL.createObjectURL(e.target.files[0])
        });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  setFigureHandler = e => {
    if (e.target.id === "set") {
      this.setState({
        setOrMinifig: "set"
      });
    }
    if (e.target.id === "figure") {
      this.setState({
        setOrMinifig: "figure"
      });
    }
  };

  sendSet = e => {
    e.preventDefault();

    const uploadTask = firebase
      .storage()
      .ref(`images/${this.state.images.name}`)
      .put(this.state.images);
    uploadTask.on(
      "state_changed",
      snapshot => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        firebase
          .storage()
          .ref("images")
          .child(this.state.images.name)
          .getDownloadURL()
          .then(url => {
            this.setState({ url });

            let filters = [];
            for (let [key, value] of this.state.checkedItems) {
              if (value === true) {
                filters.push(key);
              }
            }

            const formData = new FormData();
            formData.append("images", url);
            formData.append("name", this.state.name);
            filters.forEach(filter => {
              formData.append("filters", filter);
            });

            formData.append("setNumber", this.state.setNumber);
            formData.append("pieceNumber", this.state.pieceNumber);
            formData.append("minifigNumber", this.state.minifigNumber);
            formData.append("quality", this.state.quality);
            formData.append("included", this.state.included);
            formData.append("description", this.state.description);
            formData.append("year", this.state.year);

            // https://lego-star-wars-tracker.herokuapp.com/collection/sets

            fetch(
              "https://lego-star-wars-tracker.herokuapp.com/collection/sets",
              {
                method: "POST",
                body: formData,
                headers: {
                  Authorization: "Bearer " + this.props.token
                }
              }
            )
              .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                  throw new Error("Creating or editing a post failed!");
                }
                return res.json();
              })
              .then(resData => {
                this.setState({ redirectToHome: true });
              })
              .catch(err => {
                console.log(err);
              });
          });
      }
    );
  };

  sendFigure = e => {
    e.preventDefault();

    const uploadTask = firebase
      .storage()
      .ref(`images/${this.state.images.name}`)
      .put(this.state.images);
    uploadTask.on(
      "state_changed",
      snapshot => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        firebase
          .storage()
          .ref("images")
          .child(this.state.images.name)
          .getDownloadURL()
          .then(url => {
            this.setState({ url });

            let filters = [];
            for (let [key, value] of this.state.checkedItems) {
              if (value === true) {
                filters.push(key);
              }
            }

            const formData = new FormData();
            formData.append("images", url);
            formData.append("name", this.state.name);
            filters.forEach(filter => {
              formData.append("filters", filter);
            });
            formData.append("appearsIn", this.state.appearsIn);
            formData.append("figureId", this.state.figureId);
            formData.append("setNumber", this.state.setNumber);
            formData.append("quality", this.state.quality);
            formData.append("included", this.state.included);
            formData.append("description", this.state.description);
            formData.append("year", this.state.year);
            // https://lego-star-wars-tracker.herokuapp.com/collection/minifigs
            fetch(
              "https://lego-star-wars-tracker.herokuapp.com/collection/minifigs",
              {
                method: "POST",
                body: formData,
                headers: {
                  Authorization: "Bearer " + this.props.token
                }
              }
            )
              .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                  throw new Error("Creating or editing a post failed!");
                }
                return res.json();
              })
              .then(resData => {
                this.setState({ redirectToHome: true });
              })
              .catch(err => {
                console.log(err);
              });
          });
      }
    );

    // let filters = [];
    // for (let [key, value] of this.state.checkedItems) {
    //   if (value === true) {
    //     filters.push(key);
    //   }
    // }

    // const formData = new FormData();
    // formData.append("images", this.state.images);
    // formData.append("name", this.state.name);
    // filters.forEach(filter => {
    //   formData.append("filters", filter);
    // });
    // formData.append("appearsIn", this.state.appearsIn);
    // formData.append("figureId", this.state.figureId);
    // formData.append("setNumber", this.state.setNumber);
    // formData.append("quality", this.state.quality);
    // formData.append("included", this.state.included);
    // formData.append("description", this.state.description);
    // formData.append("year", this.state.year);

    // // "https://lego-star-wars-tracker.herokuapp.com/collection/minifigs"
    // fetch("https://lego-star-wars-tracker.herokuapp.com/collection/minifigs", {
    //   method: "POST",
    //   body: formData,
    //   headers: {
    //     Authorization: "Bearer " + this.props.token
    //   }
    // })
    //   .then(res => {
    //     if (res.status !== 200 && res.status !== 201) {
    //       throw new Error("Creating or editing a post failed!");
    //     }
    //     return res.json();
    //   })
    //   .then(resData => {
    //     this.setState({ redirectToHome: true });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  };

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <header>
          <BackLink />
        </header>

        <main id="add-set-page">
          <div id="set-figure-selector">
            <div
              className={this.state.setOrMinifig === "set" ? "selected" : null}
              id="set"
              name="set"
              onClick={this.setFigureHandler}
            >
              Set
            </div>
            <div
              className={
                this.state.setOrMinifig === "figure" ? "selected" : null
              }
              id="figure"
              name="figure"
              onClick={this.setFigureHandler}
            >
              MiniFgure
            </div>
          </div>
          {/* <h1>Add a set to your inventory</h1> */}
          <form
            id="add-set"
            onSubmit={
              this.state.setOrMinifig === "set"
                ? e => {
                    e.preventDefault();
                    this.sendSet(e);
                  }
                : e => {
                    e.preventDefault();
                    this.sendFigure(e);
                  }
            }
          >
            <fieldset className="form-item">
              <label htmlFor="name">
                {this.state.setOrMinifig === "set"
                  ? "Set Name"
                  : "Minifigure Name"}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </fieldset>
            <fieldset className="form-item">
              <figure
                id={!this.state.imagePreview ? "prevImage-close" : "prevImage"}
              >
                <img
                  src={this.state.imagePreview ? this.state.imagePreview : null}
                  alt=""
                />
              </figure>
              <label htmlFor="images">Images</label>
              <input
                type="file"
                name="images"
                id="images"
                onChange={this.handleChange}
              />
            </fieldset>
            <fieldset className="form-item">
              {/* ------------------ set only ---------------------- */}
              <div className="form-shared-line">
                <label htmlFor="setNumber">
                  {this.state.setOrMinifig === "set"
                    ? "Set Number"
                    : "Figure Id"}
                </label>
                <input
                  type="number"
                  name="setNumber"
                  id="setNumber"
                  placeholder="0"
                  value={this.state.setNumber}
                  onChange={this.handleChange}
                />
              </div>

              <div
                className={
                  this.state.setOrMinifig === "set"
                    ? "form-shared-line"
                    : "closed-inputs"
                }
              >
                <label htmlFor="pieceNumber">Number of Pieces</label>
                <input
                  type="number"
                  name="pieceNumber"
                  id="pieceNumber"
                  placeholder="0"
                  value={this.state.pieceNumber}
                  onChange={this.handleChange}
                />
              </div>
              {/* ------------------ figure only ---------------------- */}

              <div
                className={
                  this.state.setOrMinifig === "figure"
                    ? "form-shared-line"
                    : "closed-inputs"
                }
              >
                <label htmlFor="appearsIn">Set Appeared In</label>
                <input
                  type="number"
                  name="appearsIn"
                  id="appearsIn"
                  multiple
                  placeholder="Set #"
                  value={this.state.appearsIn}
                  onChange={this.handleChange}
                />
              </div>
            </fieldset>

            <fieldset className="form-item">
              <div className="form-shared-line">
                <div className="section-title">Set Quality</div>
                <label htmlFor="New">New</label>
                <input
                  type="radio"
                  name="quality"
                  id="New"
                  value="New"
                  onChange={this.handleChange}
                />
                <label htmlFor="Used">Used</label>
                <input
                  type="radio"
                  name="quality"
                  id="Used"
                  value="Used"
                  onChange={this.handleChange}
                />
              </div>
              <div
                className={
                  this.state.setOrMinifig === "set"
                    ? "form-shared-line"
                    : "closed-inputs"
                }
              >
                <label htmlFor="minifigNumber">Minifigures</label>
                <input
                  type="number"
                  name="minifigNumber"
                  id="minifigNumber"
                  placeholder="0"
                  value={this.state.minifigNumber}
                  onChange={this.handleChange}
                />
              </div>
            </fieldset>

            <fieldset className="form-item">
              <label htmlFor="year">Year Released</label>
              <input
                type="number"
                name="year"
                id="year"
                placeholder="1991"
                value={this.state.year}
                onChange={this.handleChange}
              />
            </fieldset>

            <fieldset className="form-item">
              <div className="section-title">Choose Collection(s)</div>
              <ul id="filter-list">
                {this.state.filterChecks.map((check, index) => {
                  return (
                    <li key={index}>
                      <input
                        type="checkbox"
                        name="filters"
                        checked={this.state.checkedItems.get(check)}
                        id={check}
                        onChange={this.handleChange}
                      />
                      <label htmlFor={check}>{check}</label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
            <fieldset className="form-item">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                value={this.state.description}
                onChange={this.handleChange}
              ></textarea>
            </fieldset>
            <fieldset className="form-item">
              <label htmlFor="included">Included</label>
              <textarea
                name="included"
                id="included"
                value={this.state.included}
                onChange={this.handleChange}
              ></textarea>
            </fieldset>
            <button type="submit">
              {this.state.setOrMinifig === "set" ? "Add Set" : "Add Figure"}
            </button>
          </form>
        </main>
      </React.Fragment>
    );
  }
}
