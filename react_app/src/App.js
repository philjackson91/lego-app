import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

// components
import FooterNav from "./components/footer-nav";
import FilterNav from "./components/filter-nav";
import SearchToggle from "./components/large-serach-toggle";

// pages
import LoginPage from "./pages/Auth/Login";
import SignOutPage from "./pages/Auth/SignOut";

import HomePage from "./pages/collection/home-page";
import MinifigPage from "./pages/collection/minifig-page";
import ItemDetailPage from "./pages/collection/item-detail-page";
import EditSetPage from "./pages/collection/edit-set-page";
import AddSetPage from "./pages/collection/add-set-page";
import SearchPage from "./pages/collection/search-page";

class App extends Component {
  state = {
    isAuth: false,
    token: null,
    userId: null,
    authLoading: false,
    error: null,
    navVisible: true,
    sets: []
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const userId = localStorage.getItem("userId");
    this.setState({ isAuth: true, token: token, userId: userId });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = event => {
    let prevPos = this.state.prevScrollPosition;
    let currPos = window.pageYOffset;
    if (currPos > prevPos) {
      this.setState({
        navVisible: false
      });
    } else {
      this.setState({
        navVisible: true
      });
    }
    this.setState({
      prevScrollPosition: currPos
    });
  };

  signupHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    // https://lego-star-wars-tracker.herokuapp.com/auth/signup
    fetch("https://lego-star-wars-tracker.herokuapp.com/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Creating a user failed!");
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ isAuth: false, authLoading: false });
        this.loginHandler(event, authData);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });
  };

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch("https://lego-star-wars-tracker.herokuapp.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error("Validation failed.");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log("Error!");
          throw new Error("Could not authenticate you!");
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          isAuth: true,
          token: resData.token,
          authLoading: false,
          userId: resData.userId
        });
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err
        });
      });
  };

  setAutoLogout = milliseconds => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  render() {
    let routes = (
      <Switch>
        <Route
          path="/"
          exact
          render={props => (
            <LoginPage
              {...props}
              onLogin={this.loginHandler}
              onSignup={this.signupHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        )} />
        <Redirect to="/" />
      </Switch>
    );
    if (this.state.isAuth) {
      routes = (
        <Switch>
          <Route
            path="/signout"
            exact
            render={props => <SignOutPage signout={this.logoutHandler} />}
          />
          <Route
            path="/"
            exact
            render={props => (
              <HomePage userId={this.state.userId} token={this.state.token} />
            )}
          />
          <Route
            path="/minifigs"
            render={props => (
              <MinifigPage
                userId={this.state.userId}
                token={this.state.token}
              />
            )}
          />
          <Route
            path="/add"
            render={props => (
              <AddSetPage userId={this.state.userId} token={this.state.token} />
            )}
          />
          <Route path="/search" component={SearchPage} />
          />
          <Route path="/edit" component={EditSetPage} />
          <Route path="/details" component={ItemDetailPage} />
          {/* <Redirect to="/" /> */}
        </Switch>
      );
    }
    return (
      <React.Fragment>
        {this.state.isAuth &&
        (this.props.location.pathname === "/" ||
          this.props.location.pathname === "/minifigs") ? (
          <header className={!this.state.navVisible ? "header remove" : null}>
            <SearchToggle token={this.state.token} />
            <FilterNav />
          </header>
        ) : null}

        {routes}

        {this.state.isAuth &&
        (this.props.location.pathname === "/" ||
          this.props.location.pathname === "/minifigs") ? (
          <FooterNav />
        ) : null}
      </React.Fragment>
    );
  }
}

export default withRouter(App);
