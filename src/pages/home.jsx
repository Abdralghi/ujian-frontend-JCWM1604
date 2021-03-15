import React, { Component } from "react";
import Header from "../components/header";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from "reactstrap";
import "../components/button.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { API_URL, currencyFormatter } from "../helper";
import Loading from "../components/loading";
import axios from "axios";
import { CartAction } from "../redux/actions";
import { connect } from "react-redux";
import GreenSlide from "../images/GreenSlide.png";
import BrownSlide from "../images/BrownSlide.png";
import RedSlide from "../images/RedSlide.png";

class Home extends Component {
  state = {
    data: [],
    loading: true,
    qty: 1,
  };

  componentDidMount() {
    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ data: res.data });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  renderProducts = () => {
    return this.state.data.map((val, index) => {
      return (
        <div key={index} className="col-md-3">
          <Card className="shadow-sm">
            <CardImg
              top
              width="100%"
              height="190vh"
              src={val.img}
              alt="Card image cap"
            />
            <CardBody>
              <CardTitle tag="h5">{val.name}</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                {currencyFormatter(val.price)}
              </CardSubtitle>
              <Link
                to={{ pathname: `/product/${val.id}`, state: { product: val } }}
              >
                <Button style={{ backgroundColor: "black" }}>
                  Add To Cart
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      );
    });
  };

  render() {
    const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "60px",
      slidesToShow: 1,
      speed: 500,
    };
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <div>
        <Header />
        <div className="bg-dark">
          <Slider {...settings} autoplay dots>
            <div
              className="d-flex justify-content-center pb-3 pt-3"
              style={{ height: "40vh" }}
            >
              <img src={GreenSlide} width="80%" height="100%" alt="" />
            </div>
            <div
              className="d-flex justify-content-center pb-3 pt-3"
              style={{ height: "40vh" }}
            >
              <img src={BrownSlide} width="80%" height="100%" alt="" />
            </div>
            <div
              className="d-flex justify-content-center pb-3 pt-3"
              style={{ height: "40vh" }}
            >
              <img src={RedSlide} width="80%" height="100%" alt="" />
            </div>
          </Slider>
        </div>
        <div className="container d-flex mt-5">
          <div className="mr-3">
            <h4 style={{ fontWeight: "bold" }}>Shoes</h4>
          </div>
        </div>
        <section className="container mt-1 mb-4">
          <div className="row">{this.renderProducts()}</div>
        </section>
      </div>
    );
  }
}

const MapstatetoProps = (state) => {
  return { dataUser: state.Auth };
};

export default connect(MapstatetoProps, { CartAction })(Home);
