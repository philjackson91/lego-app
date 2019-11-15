import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../config/firebase";

import BackLink from "../../components/back-link";

class itemDetailPage extends Component {
  state = {
    item: this.props.location.state.item,
    itemType: this.props.location.state.itemType,
    sets: this.props.location.state.sets,
    figures: this.props.location.state.figures,
    showDeletePopup: false
  };

  deleteToggle = () => {
    this.setState(prevState => {
      return { showDeletePopup: !prevState.showDeletePopup };
    });
  };

  deleteItem = () => {
    let url =
      this.state.itemType === "set"
        ? "https://lego-star-wars-tracker.herokuapp.com/collection/delete-set"
        : "https://lego-star-wars-tracker.herokuapp.com/collection/delete-figure";

    firebase
      .storage()
      .refFromURL(this.state.item.images)
      .delete()
      .then()
      .catch(err => {
        console.log("error deleting previous image: ", err);
      });
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.location.state.token
      },
      body: JSON.stringify({
        item: this.state.item
      })
    })
      .then(i => {
        this.props.history.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let slideshow = [];

    if (this.state.itemType === "set") {
      let setNumber = this.state.item.SetNumber;
      if (this.state.figures) {
        let temp = this.state.figures.filter(figure => {
          if (figure.appearsIn === setNumber) {
            return figure;
          }
          return null;
        });
        slideshow.push({ images: this.state.item.images }, ...temp);
      } else {
        slideshow.push({ images: this.state.item.images });
      }
    }

    if (this.state.itemType === "figure") {
      let setNumber = this.state.item.appearsIn;
      if (this.state.sets) {
        let temp = this.state.sets.filter(set => {
          if (set.SetNumber === setNumber) {
            return set;
          }
          return null;
        });
        slideshow.push({ images: this.state.item.images }, ...temp);
      } else {
        slideshow.push({ images: this.state.item.images });
      }
    }

    return (
      <React.Fragment>
        <header id="detail-header">
          <BackLink />
          <Link
            to={{
              pathname: "/search",
              state: {
                itemType: this.state.itemType,
                token: this.props.location.state.token
              }
            }}
          >
            search
          </Link>
        </header>
        <main id="detail-page">
          <section id="detail-top">
            <img src={this.state.item.images} alt="" />
            <h1>{this.state.item.name}</h1>
          </section>

          {this.state.itemType === "set" ? (
            <section className="detail-banner">
              <div id="set-number" className="detail-banner_container">
                <p>{this.state.item.SetNumber}</p>
              </div>
              <div id="quality" className="detail-banner_container">
                <p>{this.state.item.quality}</p>
              </div>
              <div id="minifig-number" className="detail-banner_container">
                <p>{this.state.item.minifigNumber}</p>
              </div>
              <div id="piece-number" className="detail-banner_container">
                <p>{this.state.item.pieceNumber}</p>
              </div>
            </section>
          ) : (
            <section id="detail-banner-figures" className="detail-banner">
              <div id="set-number" className="detail-banner_container">
                <p>{this.state.item.SetNumber}</p>
              </div>
              <div id="quality" className="detail-banner_container">
                <p>{this.state.item.quality}</p>
              </div>
            </section>
          )}

          <section id="image-slideshow">
            {slideshow.map((item, index) => {
              return (
                <figure key={index}>
                  <img src={item.images} alt="" />
                </figure>
              );
            })}
          </section>

          <section id="detail-description">
            <p>{this.state.item.description}</p>
          </section>

          <section id="detail-includes">
            <ul>
              {this.state.item.included.split(".").map((point, index) => {
                if (point !== "") {
                  return <li key={index}>{point}</li>;
                }
                return null;
              })}
            </ul>
          </section>

          <div id="item-config">
            <Link
              to={{
                pathname: "/edit",
                state: {
                  ...this.state,
                  token: localStorage.getItem("token"),
                  userId: localStorage.getItem("userId")
                }
              }}
            >
              Edit
            </Link>
            <button onClick={this.deleteToggle}>Delete</button>
          </div>
          <div
            className={
              this.state.showDeletePopup ? "popup-container" : "disabled-popup"
            }
          >
            <div className="backdrop"></div>
            <div className="popup-content_container">
              <h1>
                Are you sure youd like to delete this{" "}
                {this.state.itemType === "set" ? "set" : "figure"}?
              </h1>
              <div className="popup-content_button-container">
                <button id="popup-content_delete" onClick={this.deleteItem}>
                  Yes
                </button>
                <button onClick={this.deleteToggle} id="popup-content_back">
                  No
                </button>
              </div>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(itemDetailPage);
