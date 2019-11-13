import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import firebase from "../../config/firebase";
import "firebase/firestore";

import BackLink from "../../components/back-link";

export default class addSetPage extends Component {
  state = {
    originalSetDetails: this.props.location.state.item,
    name: this.props.location.state.item.name,
    prevImage: this.props.location.state.item.images,
    imagePreview: "",
    setNumber: this.props.location.state.item.SetNumber,
    pieceNumber: this.props.location.state.item.pieceNumber,
    appearsIn: this.props.location.state.item.appearsIn,
    quality: this.props.location.state.item.quality,
    minifigNumber: this.props.location.state.item.minifigNumber,
    year: this.props.location.state.item.year,
    prevFilters: [...this.props.location.state.item.filters],
    filters: [],
    description: this.props.location.state.item.description,
    included: this.props.location.state.item.included,
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
    setOrMinifig: this.props.location.state.itemType,
    redirectToHome: false,
    hasChanged: false
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    if (this.state.filters.length === 0) {
      this.state.prevFilters.map(filter => {
        const item = filter;
        const isChecked = true;
        this.setState(prevState => ({
          checkedItems: prevState.checkedItems.set(item, isChecked)
        }));
      });
    }
  }

  handleChange = e => {
    switch (e.target.name) {
      case "filters":
        const item = e.target.id;
        const isChecked = e.target.checked;
        this.setState(prevState => ({
          checkedItems: prevState.checkedItems.set(item, isChecked),
          hasChanged: true
        }));
        break;
      case "images":
        this.setState({
          images: e.target.files[0],
          hasChanged: true,
          imagePreview: URL.createObjectURL(e.target.files[0])
        });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value, hasChanged: true });
    }
  };

  updateSet = e => {
    e.preventDefault();

    let filters = [];
    for (let [key, value] of this.state.checkedItems) {
      if (value === true) {
        filters.push(key);
      }
    }

    if (this.state.hasChanged) {
      if (this.state.images) {
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
                firebase
                  .storage()
                  .refFromURL(this.state.prevImage)
                  .delete()
                  .then()
                  .catch(err => {
                    console.log("error deleting previous image: ", err);
                  });

                this.setState({ url });

                let filters = [];
                for (let [key, value] of this.state.checkedItems) {
                  if (value === true) {
                    filters.push(key);
                  }
                }

                const formData = new FormData();
                formData.append("images", url);
                formData.append("itemType", this.state.setOrMinifig);
                formData.append("name", this.state.name);
                filters.forEach(filter => {
                  formData.append("filters", filter);
                });

                formData.append("SetNumber", this.state.setNumber);
                formData.append("pieceNumber", this.state.pieceNumber);
                formData.append("minifigNumber", this.state.minifigNumber);
                formData.append("quality", this.state.quality);
                formData.append("included", this.state.included);
                formData.append("description", this.state.description);
                formData.append("year", this.state.year);

                // https://lego-star-wars-tracker.herokuapp.com/collection/edit

                fetch(
                  "https://lego-star-wars-tracker.herokuapp.com/collection/edit",
                  {
                    method: "POST",
                    body: formData,
                    headers: {
                      Authorization: "Bearer " + this.props.location.state.token
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
      } else {
        let filters = [];
        for (let [key, value] of this.state.checkedItems) {
          if (value === true) {
            filters.push(key);
          }
        }

        const formData = new FormData();
        formData.append("images", this.state.prevImage);
        formData.append("itemType", this.state.setOrMinifig);
        formData.append("name", this.state.name);
        filters.forEach(filter => {
          formData.append("filters", filter);
        });

        formData.append("SetNumber", this.state.setNumber);
        formData.append("pieceNumber", this.state.pieceNumber);
        formData.append("minifigNumber", this.state.minifigNumber);
        formData.append("quality", this.state.quality);
        formData.append("included", this.state.included);
        formData.append("description", this.state.description);
        formData.append("year", this.state.year);

        // https://lego-star-wars-tracker.herokuapp.com/collection/edit

        fetch("https://lego-star-wars-tracker.herokuapp.com/collection/edit", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "Bearer " + this.props.location.state.token
          }
        })
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
      }
    } else {
      return;
    }

    // let state = this.props.location.state;

    // const formData = new FormData();
    // // formData.append("image", this.state.images);
    // formData.append("SetNumber", state.item.SetNumber);
    // formData.append("itemType", state.itemType);
    // fetch("http://localhost:8080/collection/edit", {
    //   method: "POST",
    //   body: formData,
    //   headers: {
    //     Authorization: "Bearer " + this.props.location.state.token
    //   }
    // });
  };

  updateFigure = e => {
    e.preventDefault();

    let filters = [];
    for (let [key, value] of this.state.checkedItems) {
      if (value === true) {
        filters.push(key);
      }
    }

    if (this.state.hasChanged) {
      if (this.state.images) {
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
                firebase
                  .storage()
                  .refFromURL(this.state.prevImage)
                  .delete()
                  .then()
                  .catch(err => {
                    console.log("error deleting previous image: ", err);
                  });

                this.setState({ url });

                let filters = [];
                for (let [key, value] of this.state.checkedItems) {
                  if (value === true) {
                    filters.push(key);
                  }
                }

                const formData = new FormData();
                formData.append("images", url);
                formData.append("itemType", this.state.setOrMinifig);
                formData.append("name", this.state.name);
                filters.forEach(filter => {
                  formData.append("filters", filter);
                });
                formData.append("appearsIn", this.state.appearsIn);
                formData.append("figureId", this.state.figureId);
                formData.append("SetNumber", this.state.setNumber);

                formData.append("quality", this.state.quality);
                formData.append("included", this.state.included);
                formData.append("description", this.state.description);
                formData.append("year", this.state.year);

                // https://lego-star-wars-tracker.herokuapp.com/collection/edit

                fetch(
                  "https://lego-star-wars-tracker.herokuapp.com/collection/edit",
                  {
                    method: "POST",
                    body: formData,
                    headers: {
                      Authorization: "Bearer " + this.props.location.state.token
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
      } else {
        let filters = [];
        for (let [key, value] of this.state.checkedItems) {
          if (value === true) {
            filters.push(key);
          }
        }

        const formData = new FormData();
        formData.append("images", this.state.prevImage);
        formData.append("itemType", this.state.setOrMinifig);
        formData.append("name", this.state.name);
        filters.forEach(filter => {
          formData.append("filters", filter);
        });
        formData.append("appearsIn", this.state.appearsIn);
        formData.append("figureId", this.state.figureId);
        formData.append("SetNumber", this.state.setNumber);

        formData.append("quality", this.state.quality);
        formData.append("included", this.state.included);
        formData.append("description", this.state.description);
        formData.append("year", this.state.year);

        // https://lego-star-wars-tracker.herokuapp.com/collection/edit

        fetch("https://lego-star-wars-tracker.herokuapp.com/collection/edit", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "Bearer " + this.props.location.state.token
          }
        })
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
      }
    } else {
      return;
    }
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

          <form
            id="add-set"
            onSubmit={
              this.state.setOrMinifig === "set"
                ? this.updateSet
                : this.updateFigure
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
            <figure id="prevImage">
              <img
                src={
                  this.state.imagePreview
                    ? this.state.imagePreview
                    : this.state.prevImage
                }
                alt=""
              />
            </figure>
            <fieldset className="form-item">
              <div className="image-preview">
                {/* {this.state.images.length !== 0 ? null : null} */}
              </div>
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
                  checked={this.state.quality === "New" ? true : false}
                  onChange={this.handleChange}
                />
                <label htmlFor="Used">Used</label>
                <input
                  type="radio"
                  name="quality"
                  id="Used"
                  value="Used"
                  checked={this.state.quality === "Used" ? true : false}
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
              {this.state.setOrMinifig === "set"
                ? "Update Set"
                : "Update Figure"}
            </button>
          </form>
        </main>
      </React.Fragment>
    );
  }
}
