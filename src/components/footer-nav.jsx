import React from "react";
import { NavLink } from "react-router-dom";

export default function footerNav() {
  return (
    <footer>
      <nav id="nav-footer">
        <NavLink
          id="sets-link"
          to="/"
          exact={true}
          activeClassName="selectedLink"
        >
          sets
        </NavLink>
        <NavLink
          id="minifig-link"
          to="/minifigs"
          activeClassName="selectedLink"
        >
          minifigs
        </NavLink>

        <NavLink id="add-set-link" to="/add" activeClassName="selectedLink">
          add set
        </NavLink>
        <NavLink id="signout-link" to="/signout" activeClassName="selectedLink">
          signout
        </NavLink>
      </nav>
    </footer>
  );
}
