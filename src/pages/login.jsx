import React, { Component } from "react";
import Header from "../components/header";
import { Button, Form, Alert } from "reactstrap";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "../components/materialUi";
import { LoginActionThunk } from "../redux/actions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import image from "../images/bg-landing.png";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import Loader from "react-loader-spinner";
import "./styles/login.css";

class LoginPage extends Component {
  state = {
    username: "",
    password: "",
  };

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onLoginSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.username);
    const { username, password } = this.state;
    // axios
    //   .get(`${API_URL}/users?username=${username}&password=${password}`)
    //   .then((res) => {
    //     if (res.data.length) {
    //       localStorage.setItem("id", res.data[0].id);
    //       this.props.LoginAction(res.data[0]);
    //       toast.success("Login Berhasil!", {
    //         position: "top-center",
    //         autoClose: 3000,
    //         hideProgressBar: true,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //       });
    //     } else {
    //       toast.error("User tidak ditemukan!", {
    //         position: "top-center",
    //         autoClose: 3000,
    //         hideProgressBar: true,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    var data = { username, password };
    this.props.LoginActionThunk(data);
  };

  render() {
    if (this.props.dataUser.islogin) {
      return <Redirect to="/home" />;
    }
    const { classes } = this.props;
    return (
      <div>
        <Header />
        <div className="d-flex">
          <div className="d-flex position-relative">
            <img src={image} width="100%" alt="" />
          </div>
          <div
            className="div-login position-absolute shadow-sm d-flex align-items-center justify-content-center col-md-4 rounded"
            style={{ top: 100, left: 100 }}
          >
            <Form onSubmit={this.onLoginSubmit}>
              <h1 style={{ color: "#121212" }}>Welcome Back!</h1>
              <div className="d-flex my-3">
                <TextField
                  id="outlined-username-input"
                  label="Email"
                  type="email"
                  autoComplete="current-username"
                  variant="outlined"
                  name="username"
                  onChange={this.onInputChange}
                  value={this.state.username}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                />
              </div>
              <div className="my-3">
                <TextField
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  name="password"
                  onChange={this.onInputChange}
                  value={this.state.password}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    },
                  }}
                />
              </div>
              <button className="tmbl-login ">
                LOGIN &nbsp;
                <HiOutlineArrowNarrowRight style={{ fontSize: "25" }} />
              </button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const MapstatetoProps = (state) => {
  return {
    dataUser: state.Auth,
  };
};

export default connect(MapstatetoProps, { LoginActionThunk })(
  withStyles(styles)(LoginPage)
);
