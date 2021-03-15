import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { RiShoppingCartLine } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import "./header.css";
import { LogoutAction } from "../redux/actions";
import { toast } from "react-toastify";

class Header extends Component {
  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  onLogoutClick = () => {
    localStorage.removeItem("id");
    this.props.LogoutAction();
    toast.dark("Logout berhasil", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  render() {
    return (
      <Navbar className="px-5 header-bg" expand="md">
        <Link to="/">
          <NavbarBrand
            style={{ color: "black", fontWeight: "600", letterSpacing: "2px" }}
          >
            ShoeS
          </NavbarBrand>
        </Link>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {this.props.dataUser.islogin ? (
              <>
                <NavItem className="py-2 mx-3">
                  <Link to="/cart">
                    <RiShoppingCartLine
                      style={{ color: "black", fontSize: "25px" }}
                    />
                  </Link>
                  {this.props.dataUser.cart.length ? (
                    <Badge
                      color="danger"
                      pill
                      style={{
                        position: "relative",
                        bottom: 10,
                        right: 10,
                      }}
                    >
                      {this.props.dataUser.cart.length}
                    </Badge>
                  ) : null}
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle style={{ color: "black" }} nav>
                    {this.props.dataUser.username}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <Link to="/history" className="normal-link">
                      <DropdownItem>History</DropdownItem>
                    </Link>
                    <Link to="/home" className="normal-link">
                      <DropdownItem>Home</DropdownItem>
                    </Link>
                    <DropdownItem divider />
                    <Link to="/" className="normal-link">
                      <DropdownItem onClick={this.onLogoutClick}>
                        Sign Out
                      </DropdownItem>
                    </Link>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </>
            ) : (
              <>
                <div>
                  <NavItem className="mr-2 ">
                    <Link
                      className="header-color"
                      style={{
                        color: "black",
                        fontWeight: "500",
                        fontSize: "18px",
                      }}
                      to="/login"
                    >
                      Sign In
                    </Link>
                  </NavItem>
                </div>
                <div>
                  <NavItem>
                    <AiOutlineUser
                      style={{ color: "black", fontSize: "23px" }}
                    />
                  </NavItem>
                </div>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

const MapstatetoProps = (state) => {
  return { dataUser: state.Auth };
};

export default connect(MapstatetoProps, { LogoutAction })(Header);
