import React, { Component } from "react";
import Header from "../components/header";
import { API_URL } from "../helper/ApiUrl";
import Loading from "../components/loading";
import axios from "axios";
import { connect } from "react-redux";
import "./styles/productdetail.css";
import { toast } from "react-toastify";
import { CartAction } from "../redux/actions";
import { Button } from "reactstrap";
import { currencyFormatter } from "../helper";

class ProductDetail extends Component {
  state = { product: {}, loading: true, qty: 1 };

  componentDidMount() {
    var idprod = this.props.match.params.idprod;
    var data = this.props.location.state;
    if (!data) {
      axios
        .get(`${API_URL}/products/${idprod}`)
        .then((res) => {
          this.setState({ product: res.data });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ product: data.product, loading: false });
    }
  }

  onQtyClick = (operator) => {
    if (operator === "tambah") {
      var hasil = this.state.qty + 1;
      if (hasil > this.state.product.stock) {
        toast.error("Melebihi stok!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        this.setState({ qty: this.state.qty + 1 });
      }
    } else {
      var hasil = this.state.qty - 1;
      if (hasil < 1) {
        toast.error("Tidak boleh kurang dari 1!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        this.setState({ qty: this.state.qty - 1 });
      }
    }
  };

  onAddToCartClick = () => {
    if (this.props.dataUser.islogin === false) {
      toast.warning("Anda belum login!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      let id = this.props.dataUser.id;
      let idprod = this.state.product.id;
      let stock = this.state.product.stock;
      axios
        .get(`${API_URL}/users/${id}`)
        .then((res) => {
          var cart = res.data.cart;
          let findIdx = cart.findIndex((val) => val.id == idprod);
          if (findIdx < 0) {
            let data = {
              ...this.state.product,
              qty: this.state.qty,
            };
            cart.push(data);
            axios
              .patch(`${API_URL}/users/${id}`, { cart: cart })
              .then((res1) => {
                this.props.CartAction(res1.data.cart);
                toast.dark("Berhasil!", {
                  position: "top-center",
                  autoClose: 1500,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            let qtyakhir = cart[findIdx].qty + this.state.qty;
            if (qtyakhir > stock) {
              var qtyablebuy = stock - cart[findIdx].qty;
              toast.error("Barang di cart melebihi stok!", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } else {
              cart[findIdx].qty = qtyakhir;
              axios
                .patch(`${API_URL}/users/${id}`, { cart: cart })
                .then((res1) => {
                  this.props.CartAction(res1.data.cart);
                  toast.dark("Berhasil!", {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    if (this.state.loadiing) {
      return <Loading />;
    }
    return (
      <div>
        <Header />
        <div className="prod-cont">
          <div className="d-flex row justify-content-center pl-3">
            <div
              style={{ overflow: "hidden", height: "400px", width: "400px" }}
              className="d-flex mt-5 col-md-6 rounded justify-content-center align-items-center shadow-sm"
            >
              <img height="110%" src={this.state.product.img} alt="product" />
            </div>
            <div className="col-md-6 mt-4 pl-5">
              <div className="mt-2" style={{ fontSize: "50px" }}>
                {this.state.product.name}
              </div>
              <div className="mt-0 pl-1" style={{ fontSize: "20px" }}>
                {this.state.product.description}
              </div>
              <div
                className="font-weight-bold mt-2 mb-4"
                style={{ fontSize: "35px" }}
              >
                {currencyFormatter(this.state.product.price * this.state.qty)}
              </div>
              <div
                className="d-flex bg-tombol row ml-0 justify-content-between align-items-center"
                style={{
                  width: "340px",
                  height: "70px",
                  overflow: "hidden",
                  borderRadius: "8px",
                }}
              >
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ width: "20%", height: "100%" }}
                >
                  <Button
                    onClick={() => this.onQtyClick("kurang")}
                    style={{
                      width: "100%",
                      height: "120%",
                      fontSize: 30,
                      backgroundColor: "#121212",
                      borderColor: "transparent",
                    }}
                  >
                    -
                  </Button>
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ fontSize: 35 }}
                >
                  {this.state.qty}
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ width: "20%", height: "100%" }}
                >
                  <Button
                    onClick={() => this.onQtyClick("tambah")}
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      width: "100%",
                      height: "120%",
                      fontSize: 30,
                      backgroundColor: "#121212",
                      borderColor: "transparent",
                    }}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div
                className="d-flex row mt-3 ml-0 justify-content-between align-items-center"
                style={{ width: "295px" }}
              >
                <div>
                  <Button
                    onClick={this.onAddToCartClick}
                    className="btn-add"
                    style={{ width: "100%" }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const MapstatetoProps = (state) => {
  return { dataUser: state.Auth };
};

export default connect(MapstatetoProps, { CartAction })(ProductDetail);
