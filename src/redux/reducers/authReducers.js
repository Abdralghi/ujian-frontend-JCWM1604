const INITIAL_STATE = {
  id: 0,
  username: "",
  password: "",
  role: "",
  islogin: false,
  loading: false,
  cart: [],
};

const AuthReducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        ...action.payload,
        islogin: true,
        loading: false,
      };
    case "LOGOUT":
      return INITIAL_STATE;
    case "LOADING":
      return { ...state, loading: true };
    case "ERROR":
      return { ...state, loading: false };
    case "UPDATECART":
      return { ...state, cart: action.cart };
    default:
      return state;
  }
};

export default AuthReducers;
