import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../helper/ApiUrl";

export const CartAction = (input) => {
  return {
    type: "UPDATECART",
    cart: input,
  };
};

export const LoginAction = (input) => {
  return {
    type: "LOGIN",
    payload: input,
  };
};

export const LogoutAction = () => {
  return {
    type: "LOGOUT",
  };
};

export const LoadingAction = () => {
  return {
    type: "LOADING",
  };
};

export const LoginActionThunk = (input) => {
  return (dispatch) => {
    var numbers = /[0-9]/g;
    var capital = /[a-z]/g;
    var uppercase = /[A-Z]/g;
    var word = new RegExp(capital.source + "|" + uppercase.source);
    var { username, password } = input;
    let data = {
      username,
      password,
      role: "user",
      cart: [],
    };
    dispatch({ type: "LOADING" });
    axios
      .get(`${API_URL}/users?username=${username}&password=${password}`)
      .then((res) => {
        if (res.data.length) {
          localStorage.setItem("id", res.data[0].id);
          dispatch({ type: "LOGIN", payload: res.data[0] });
          toast.dark("Login berhasil!", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (
          password.length >= 6 &&
          password.match(numbers) &&
          password.match(word)
        ) {
          dispatch({ type: "LOADING" });
          axios
            .get(`${API_URL}/users?username=${username}`)
            .then((res1) => {
              if (res1.data.length) {
                toast.error("Email sudah terdaftar!", {
                  position: "top-center",
                  autoClose: 1500,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                dispatch({ type: "ERROR" });
              } else {
                axios
                  .post(`${API_URL}/users`, data)
                  .then((res2) => {
                    localStorage.setItem("id", res2.data.id);
                    dispatch({ type: "LOGIN", payload: res2.data });
                    toast.dark("Daftar berhasil!", {
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
                    dispatch({ type: "ERROR" });
                  });
              }
            })
            .catch((err) => {
              dispatch({ type: "ERROR" });
            });
        }
        if (!username && !password) {
          toast.error("Input harus diisi!", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (!password.match(numbers)) {
          toast.error("Password harus mengandung angka!", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (!password.match(word)) {
          toast.error("Password harus mengandung huruf!", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (password.length < 6) {
          toast.error("Password harus lebih dari 6!", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((err) => {
        dispatch({ type: "ERROR" });
      });
  };
};
