import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Screen from "../components/screen/Screen";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import {
  getUserData,
  getUserMedia,
  getUserActivity,
} from "../redux/actions/dataAction";
import StaticProfile from "../components/profile/StaticProfile";
import ProfileSkeleton from "../util/ProfileSkeleton";
import ScreenSkeleton from "../util/ScreenSkeleton";
import Alert from "../util/Alert";
import { Card, Dialog, Divider, Paper, Typography } from "@material-ui/core";
import NoScreen from "../components/empty-screens/NoScreen";
import Profile from "../components/profile/Profile";
import UserTab from "../util/UserTab";
import MediaList from "../components/profile/MediaList";
import MediaSkeleton from "../util/MediaSkeleton";
import withWidth from "@material-ui/core/withWidth";
import ImageGrid from "../util/ImageGrid";
import withStyle from "@material-ui/core/styles/withStyles";
import store from "../redux/store";
import { SET_USER, STOP_LOADING_DATA } from "../redux/type";
const style = {
  root: { width: "100%" },
  smallScreen: {
    width: "133%",
    marginTop: -106,
  },
  playIcon: {
    left: "50%",
    margin: "-57px 0 0 -31px",
    position: "absolute",
    top: "50%",
    cursor: "pointer",
    zIndex: 1,
  },
  imageContent: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
};
class user extends Component {
  state = {
    profile: null,
    screenIdParam: null,
    owner: false,
    index: 0,
    currHandle: "",
  };
  componentDidMount() {
    const handle = this.props.match.params.handle;
    const screenId = this.props.match.params.screenId;
    if (handle === localStorage.getItem("handle"))
      this.setState({ owner: true });
    if (screenId)
      this.setState({
        screenIdParam: screenId,
      });
    this.props.getUserData(handle);
  }
  action = () => {
    console.log("user not found");
  };
  handleTabChange = (index) => {
    this.setState({ index });
    switch (index) {
      case 0:
        this.props.getUserData(this.props.match.params.handle);
        break;
      case 1:
        this.props.getUserActivity(this.props.match.params.handle, "polls");
        break;
      case 2:
        this.props.getUserActivity(this.props.match.params.handle, "likes");
        break;

      case 3:
        this.props.getUserActivity(this.props.match.params.handle, "comments");
        break;
      case 4:
        this.props.getUserMedia(this.props.match.params.handle, "image");
        break;
      case 5:
        this.props.getUserMedia(this.props.match.params.handle, "video");
        break;
      case 6:
        this.props.getUserMedia(this.props.match.params.handle, "audio");
        break;

      default:
        return;
    }

    console.log("tab change ", index);
  };
  componentDidUpdate() {
    let userHandle = this.props.match.params.handle;
    if (this.state.currHandle !== userHandle) {
      this.props.getUserData(userHandle);
      this.setState({
        currHandle: userHandle,
        owner: userHandle === localStorage.handle,
      });
    }
    console.log("State", this.state);
  }
  render() {
    const { media, loading } = this.props.data;
    const { screens, user } = this.props.data.user;
    const { error, message, classes, width } = this.props;
    console.log("media", media, error, this.props, "screens", screens);
    console.log("loading", loading);
    const { screenIdParam } = this.state;
    const screensMarkup = loading ? (
      this.state.index >= 4 && this.state.index <= 6 ? (
        <MediaSkeleton />
      ) : (
        <ScreenSkeleton />
      )
    ) : this.state.index >= 4 && this.state.index <= 6 ? (
      <ImageGrid
        playIconClassName={classes.playIcon}
        imageContent={classes.imageContent}
        media={media}
        user={
          this.props.data.user.user && {
            userHandle: this.props.data.user.user.handle,
            userImage: this.props.data.user.user.imageUrl,
            username: this.props.data.user.user.username,
          }
        }
        width={width}
        index={this.state.index}
      />
    ) : screens === null ? (
      <Fragment>
        <Typography variant="h6">Sorry, this page isn't available.</Typography>
        <Typography
          variant="subtitle2"
          style={{ marginTop: 20, color: "#262626" }}
        >
          The link you followed may be broken, or the page may have been
          removed. <a href="/">Go back to LetsSocially</a>
        </Typography>
      </Fragment>
    ) : screens.length === 0 ||
      (screens.length > 0 &&
        screens[0].userHandle !== this.state.currHandle) ? (
      <NoScreen />
    ) : !screenIdParam ? (
      screens.map((screen) => (
        <Screen
          key={screen.key ? screen.key : screen.screenId}
          screen={screen}
        />
      ))
    ) : (
      screens.map((screen) => {
        if (screen.screenId !== screenIdParam)
          return <Screen key={screen.screenId} screen={screen} />;
        else return <Screen key={screen.screenId} screen={screen} openDialog />;
      })
    );
    const profileMarkup =
      user === null || user.handle !== this.state.currHandle ? (
        <Fragment>
          {(user === null || user.handle !== this.state.currHandle) && (
            <ProfileSkeleton />
          )}
        </Fragment>
      ) : (
        <Fragment>
          {user !== "hide" && this.state.owner ? (
            <Profile type={width === "xs" ? "outlined" : "elevation"} />
          ) : (
            <StaticProfile
              type={width === "xs" ? "outlined" : "elevation"}
              profile={user}
            />
          )}
        </Fragment>
      );
    const smallScreenMarkup = (
      <Grid item xs={10}>
        <Paper variant="outlined" className={classes.smallScreen}>
          {profileMarkup}
          <Divider />
          {screensMarkup}
        </Paper>
      </Grid>
    );
    return (
      <Grid container spacing={10} justify="flex-end" className={classes.root}>
        <Grid item sm={1} xs={1}>
          <UserTab xs={1} sm={1} handleTabChange={this.handleTabChange} />
        </Grid>
        {width === "xs" && smallScreenMarkup}
        {width !== "xs" && (
          <Fragment>
            <Grid item sm={6} xs={10}>
              {screensMarkup}
            </Grid>
            <Grid item sm={4} xs={8}>
              {profileMarkup}
            </Grid>
          </Fragment>
        )}
      </Grid>
    );
  }
}
user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  getUserActivity: PropTypes.func.isRequired,
  getUserMedia: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  error: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
  data: state.data,
  error: state.user.error,
  message: state.user.message,
});

export default withWidth()(
  connect(mapStateToProps, {
    getUserData,
    getUserActivity,
    getUserMedia,
  })(withStyle(style)(user))
);
