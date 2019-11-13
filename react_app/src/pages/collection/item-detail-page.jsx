import React, { Component } from "react";
import { Link } from "react-router-dom";

import BackLink from "../../components/back-link";

export default class itemDetailPage extends Component {
  state = {
    item: this.props.location.state.item,
    itemType: this.props.location.state.itemType,
    sets: this.props.location.state.sets,
    figures: this.props.location.state.figures
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
        </main>
      </React.Fragment>
    );
  }
}
