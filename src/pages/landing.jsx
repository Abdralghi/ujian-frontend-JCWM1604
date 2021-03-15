import React, { Component } from "react";
import Header from "../components/header";
import image from "../images/bg-adidas.png";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import "../components/button.css";
import { Link } from "react-router-dom";

class Landing extends Component {
  state = {};
  render() {
    return (
      <div>
        <Header />
        <div className="d-flex">
          <div className="d-flex position-relative">
            <img src={image} alt="" height="100%" width="100%" />
          </div>
          <div
            className="position-absolute flex-column"
            style={{ marginLeft: "170px", marginTop: "178px" }}
          >
            <div className="h1 mb-4" style={{ fontWeight: "700" }}>
              YOU ARE <br /> A SUPERSTAR
            </div>
            <div>
              <Link to="/home">
                <button
                  className="tmbl tmbl-bg px-5 py-3 shadow-sm"
                  style={{ fontSize: "20px", fontWeight: "500" }}
                >
                  SHOP &nbsp;&nbsp;
                  <HiOutlineArrowNarrowRight style={{ fontSize: "30px" }} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
