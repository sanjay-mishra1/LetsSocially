import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import SearchBar from "../search/SearchBar";
//MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import withWidth from "@material-ui/core/withWidth";

//icon
import HomeIcon from "@material-ui/icons/Home";
import MyButton from "../../util/MyButton";
import Settings from "./Settings";
import MuiLink from "@material-ui/core/Link";

import Notification from "./Notification";
import PostScreen from "../screen/PostScreen";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import withStyle from "@material-ui/core/styles/withStyles";
import SmallProfile from "../profile/SmallProfile";
import TrendingFlatOutlinedIcon from "@material-ui/icons/TrendingFlatOutlined";
import SearchContainer from "../search/SearchContainer";
import Alert from "../../util/Alert";
const styles = (theme) => ({
  ...theme.spreadIt,

  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
});
class Navbar extends Component {
  componentDidMount() {
    // console.log("query", this.props.match.params.query);
  }
  render() {
    const { authenticated, classes, width, error, message } = this.props;
    return (
      <Fragment>
        <AppBar className={classes.appBar}>
          <Toolbar className="nav-container" style={{ width: "100%" }}>
            <Grid alignItems="center" container spacing={2}>
              {width !== "xs" && (
                <Grid item>
                  <Typography className={classes.title} variant="h6" noWrap>
                    LetsSocially
                  </Typography>
                </Grid>
              )}
              <Grid item lg={5} xs={7} sm={6} style={{ placeItems: "center" }}>
                {!window.location.href.includes("/search/") && (
                  <SearchBar from="nav" />
                )}
              </Grid>
              {authenticated ? (
                <Grid
                  item
                  lg={5}
                  xs={5}
                  sm={3}
                  style={{
                    textAlign: width === "xs" ? "center" : "end",
                  }}
                >
                  {width === "lg" && <PostScreen />}
                  <Link to="/">
                    <MyButton tip="Home">
                      <HomeIcon htmlColor="#ffffff" />
                    </MyButton>
                  </Link>
                  <Notification />
                  <Settings />
                </Grid>
              ) : (
                <Grid
                  item
                  lg={5}
                  xs={5}
                  sm={3}
                  style={{
                    textAlign: width === "xs" ? "center" : "end",
                  }}
                >
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>

                  <Button color="inherit" component={Link} to="/signup">
                    Signup
                  </Button>
                </Grid>
              )}
            </Grid>
          </Toolbar>
        </AppBar>
        {/* {window.location.href !== "/search/" && <SearchContainer from="nav" />} */}

        {authenticated && width !== "lg" && <PostScreen smallScreen />}
        {error && <Alert type="error" open={true} message={error} />}
        {message && <Alert type="success" open={true} message={message} />}
      </Fragment>
    );
  }
}
Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  error: state.user.error,
  message: state.user.message,
});

export default withWidth()(connect(mapStateToProps)(withStyle(styles)(Navbar)));
