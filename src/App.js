import React, { Component } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/notfound";
import axios from "axios";
import { API_URL } from "./helper/ApiUrl";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Home from "./pages/home";
import { connect } from "react-redux";
import { LoginAction } from "./redux/actions";
import Cart from "./pages/users/cart";
import ProductDetail from "./pages/productdetail";
import History from "./pages/users/history";
import Loading from "./components/loading";

class App extends Component {
  state = { isLoading: true };

  componentDidMount() {
    let id = localStorage.getItem("id");
    axios
      .get(`${API_URL}/users/${id}`)
      .then((res) => {
        this.props.LoginAction(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/login" exact component={Login} />
          <Route path="/home" exact component={Home} />
          <Route path="/product/:idprod" component={ProductDetail} />
          <Route path="/cart" exact component={Cart} />
          <Route path="/history" exact component={History} />
          <Route path="*" component={NotFound} />
        </Switch>
        <ToastContainer />
      </div>
    );
  }
}

const MaptstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};

export default connect(MaptstatetoProps, { LoginAction })(App);
