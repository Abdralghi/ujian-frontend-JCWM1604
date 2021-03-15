import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./styles/notfound.css";

class NotFound extends Component {
  state = {};
  render() {
    return (
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <h1>Oops!</h1>
            <h2>404 - The Page can't be found</h2>
          </div>
          <Link to="/home">Go TO Homepage</Link>
        </div>
      </div>
    );
  }
}

export default NotFound;
