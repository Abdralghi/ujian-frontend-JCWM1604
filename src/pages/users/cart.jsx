import React, { Component } from "react";
import {
  Table,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import Header from "../../components/header";
import { connect } from "react-redux";
import { API_URL, currencyFormatter } from "../../helper";
import "../styles/productdetail.css";
import axios from "axios";
import { CartAction } from "../../redux/actions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

const Myswal = withReactContent(Swal);

class Cart extends Component {
  state = {
    modal: false,
    stokadmin: [],
    loading: false,
    products: [],
  };

  componentDidMount() {
    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ products: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onMinusClick = (index) => {
    let cart = this.props.dataUser.cart;
    let hasil = cart[index].qty - 1;
    if (hasil < 1) {
      toast.warning("Delete!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      cart[index].qty = cart[index].qty - 1;
      let iduser = this.props.dataUser.id;
      axios
        .patch(`${API_URL}/users/${iduser}`, { cart: cart })
        .then((res) => {
          this.props.CartAction(res.data.cart);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onPlusClick = (index) => {
    let cart = this.props.dataUser.cart;
    let idprod = cart[index].id;
    axios
      .get(`${API_URL}/products/${idprod}`)
      .then((res) => {
        let stock = res.data.stock;
        let qty = cart[index].qty;
        let hasil = qty + 1;
        if (hasil > stock) {
          toast.error("Tidak bisa melebihi stok!", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          cart[index].qty = hasil;
          let iduser = this.props.dataUser.id;
          axios
            .patch(`${API_URL}/users/${iduser}`, { cart: cart })
            .then((res) => {
              this.props.CartAction(res.data.cart);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onDeleteClick = (index) => {
    let cart = this.props.dataUser.cart;
    Swal.fire({
      title: `Anda yakin ingin menghapus cart ${cart[index].name}?`,
      text: "Data tidak akan bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        cart.splice(index, 1);
        let iduser = this.props.dataUser.id;
        axios
          .patch(`${API_URL}/users/${iduser}`, { cart: cart })
          .then((res) => {
            this.props.CartAction(res.data.cart);
            Swal.fire("Berhasil!", "Cart sudah dihapus!", "success");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  renderCart = () => {
    return this.props.dataUser.cart.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{val.name}</td>
          <td>
            <img src={val.img} alt={val.name} width="150px" height="100vh" />
          </td>
          <td>{currencyFormatter(val.price)}</td>
          <td>
            <Button
              onClick={() => this.onMinusClick(index)}
              className="btn-dark mx-2"
              disabled={val.qty <= 1 ? true : false}
              style={{ width: "37px" }}
            >
              -
            </Button>
            {val.qty}
            <Button
              onClick={() => this.onPlusClick(index)}
              className="btn-dark mx-2"
            >
              +
            </Button>
          </td>
          <td>{currencyFormatter(val.price * val.qty)}</td>
          <td>
            <Button
              onClick={() => this.onDeleteClick(index)}
              className="btn-danger"
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    });
  };

  onCheckOutClick = async () => {
    let iduser = this.props.dataUser.id;
    let data = {
      userId: this.props.dataUser.id,
      tanggal: new Date(),
      status: "Belum bayar",
      products: this.props.dataUser.cart,
      bukti: "",
    };
    await axios.post(`${API_URL}/transactions`, data);
    var cart = this.props.dataUser.cart;
    var Productsadmin = this.state.products;
    for (let i = 0; i < cart.length; i++) {
      for (let j = 0; j < Productsadmin.length; j++) {
        if (cart[i].id === Productsadmin[j].id) {
          let stokakhir = Productsadmin[j].stock - cart[i].qty;
          await axios.patch(`${API_URL}/products/${Productsadmin[j].id}`, {
            stock: stokakhir,
          });
        }
      }
    }
    var res1 = await axios.patch(`${API_URL}/users/${iduser}`, { cart: [] });
    this.props.CartAction(res1.data.cart);
    this.setState({ modal: false });
  };

  renderTotal = () => {
    let total = 0;
    this.props.dataUser.cart.forEach((val) => {
      total += val.price * val.qty;
    });
    return total;
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    if (this.state.loading) {
      return <h1>Loading</h1>;
    }
    return (
      <div>
        <Modal
          className="my-modal"
          centered
          isOpen={this.state.modal}
          toggle={this.toggle}
        >
          <ModalHeader toggle={this.toggle}>Check Out</ModalHeader>
          <ModalBody>Apa anda yakin ingin checkout ?</ModalBody>
          <ModalFooter>
            <Button
              style={{ backgroundColor: "#121212" }}
              onClick={this.onCheckOutClick}
            >
              Checkout
            </Button>
            <Button className="btn-danger" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Header />
        <div className="mx-5">
          <Table className="mt-5">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Image</th>
                <th>Harga</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.renderCart()}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td> &nbsp; &nbsp; Total &nbsp;&nbsp;&nbsp; :</td>
                <td>{currencyFormatter(this.renderTotal())}</td>
                <td>
                  <Button
                    onClick={() => this.setState({ modal: true })}
                    className="btn-add"
                  >
                    Check Out
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const MapstatetoProps = (state) => {
  return { dataUser: state.Auth };
};

export default connect(MapstatetoProps, { CartAction })(Cart);
