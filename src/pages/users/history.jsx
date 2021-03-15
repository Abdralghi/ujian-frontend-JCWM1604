import React, { Component } from "react";
import axios from "axios";
import Header from "../../components/header";
import { API_URL, currencyFormatter, formatDate } from "../../helper";
import {
  Table,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { connect } from "react-redux";

class History extends Component {
  state = {
    pilihanId: 0,
    modal: false,
    modalDetail: false,
    bukti: "",
    history: [],
    indexdetail: -1,
  };

  async componentDidMount() {
    try {
      var res = await axios.get(
        `${API_URL}/transactions?userId=${this.props.dataUser.id}`
      );
      var res1 = await axios.get(`${API_URL}/products`);
      this.setState({
        history: res.data,
        products: res1.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  toggledetail = () => {
    this.setState({ modalDetail: !this.state.modalDetail });
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  renderTotalDetail = () => {
    let total = 0;
    this.state.history[this.state.indexdetail].products.forEach((val) => {
      total += val.price * val.qty;
    });
    return total;
  };

  renderDetail = () => {
    var indexdetail = this.state.indexdetail;
    return this.state.history[indexdetail].products.map((val, index) => {
      return (
        <tr key={index}>
          <td>{val.name}</td>
          <td>{currencyFormatter(val.price)}</td>
          <td>{val.qty}</td>
          <td>{currencyFormatter(val.qty * val.price)}</td>
        </tr>
      );
    });
  };

  onBayarClick = (index) => {
    this.setState({ indexdetail: index, modalDetail: true });
  };

  onBatalClick = async (index) => {
    try {
      let productsAdmin = this.state.products;
      let productHistory = this.state.history[index].products;
      for (let i = 0; i < productHistory.length; i++) {
        for (let j = 0; j < productsAdmin.length; j++) {
          if (productHistory[i].id === productsAdmin[j].id) {
            let stocknew = productHistory[i].qty + productsAdmin[j].stock;
            await axios.patch(`${API_URL}/products/${productsAdmin[j].id}`, {
              stock: stocknew,
            });
          }
        }
      }
      await axios.patch(
        `${API_URL}/transactions/${this.state.history[index].id}`,
        { status: "Batal" }
      );
      var res1 = await axios.get(
        `${API_URL}/transactions?userId=${this.props.dataUser.id}`
      );
      this.setState({ history: res1.data });
    } catch (error) {
      console.log(error);
    }
  };

  renderHistory = () => {
    return this.state.history.map((val, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{formatDate(val.tanggal)}</td>
          <td>{val.status}</td>
          <td>
            <Button
              onClick={() => this.onBatalClick(index)}
              className="btn-danger"
              disabled={val.status === "Batal"}
            >
              Batal
            </Button>
          </td>
          <td>
            <Button
              style={{ backgroundColor: "#121212" }}
              onClick={() => this.onBayarClick(index)}
            >
              Detail
            </Button>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div>
        {this.state.indexdetail < 0 ? null : (
          <Modal
            className="my-modal"
            size="lg"
            centered
            isOpen={this.state.modalDetail}
            toggle={this.toggledetail}
          >
            <ModalHeader toggle={this.toggledetail}>
              Detail Transaksi
            </ModalHeader>
            <ModalBody>
              <Table>
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Harga</th>
                    <th>Qty</th>
                    <th>Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderDetail()}
                  <tr>
                    <th></th>
                    <th></th>
                    <th>Total</th>
                    <th>{currencyFormatter(this.renderTotalDetail())}</th>
                  </tr>
                </tbody>
              </Table>
              <input
                className="form-control my-2"
                type="text"
                placeholder="Input Bukti"
                name="bukti"
                value={this.state.bukti}
                onChange={this.onInputChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.toggledetail} className="btn-primary">
                OK
              </Button>
              <Button className="bg-dark">Bayar</Button>
            </ModalFooter>
          </Modal>
        )}
        <Header />
        <div className="container mt-5">
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Batal</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>{this.renderHistory()}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const MapstatetoProps = (state) => {
  return { dataUser: state.Auth };
};

export default connect(MapstatetoProps)(History);
