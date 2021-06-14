import React, { Component } from "react";
import "./App.css";

//redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED } from "./redux/type";
import { logoutUser, getUserData } from "./redux/actions/userAction";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import jwtDecode from "jwt-decode";
import themeFile from "./util/theme";
import AuthRoute from "./util/AuthRoute";
//pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import user from "./pages/user";
//Components
import Navbar from "./components/layout/Navbar";
import axios from "axios";
import search from "./pages/search";
axios.defaults.baseURL =
  "https://asia-south1-letssocially.cloudfunctions.net/api";
//"http://localhost:5000/letssocially/asia-south1/api";
const theme = createMuiTheme(themeFile);
const token = localStorage.FBIdToken;
let authenticated;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.esp * 100 < Date.now() || !localStorage.getItem("handle")) {
    //token expire redirect to login
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
} else localStorage.removeItem("handle");
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar props={this.props} />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute
                  exact
                  path="/login"
                  component={login}
                  authenticated={authenticated}
                />
                <AuthRoute
                  exact
                  path="/signup"
                  component={signup}
                  authenticated={authenticated}
                />
                <Route exact path="/user/:handle" component={user} />
                <Route
                  exact
                  path="/user/:handle/screen/:screenId"
                  component={user}
                />
                <Route exact path="/search/" component={search} />
              </Switch>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
