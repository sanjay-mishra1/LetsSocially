import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
//MUI stuffs
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import DeleteScreen from "./DeleteScreen";
import { Chat } from "@material-ui/icons";
import ScreenDialog from "./ScreenDialog";
import LikeButton from "./LikeButton";
import ScreenImage from "./ScreenImage";
import ShowPoll from "./ShowPoll";
//redux
import {
  addPollResponse,
  getScreenLikes,
} from "../../redux/actions/dataAction";
import { withWidth } from "@material-ui/core";
import UserList from "../profile/UserList";
const styles = {
  card: {
    // display: "flex",
    marginBottom: 20,
  },
  content1: {
    display: "flex",
    width: "-webkit-fill-available",
    objectFit: "cover",
    padding: "inherit",
    marginTop: 4,
    textAlign: "start",
  },
  hashtag: {
    color: "#369fff",
  },
  image: {
    borderRadius: 64,
    width: 75,
    height: 64,
    margin: 10,
  },
  content: {
    width: "-webkit-fill-available",
    objectFit: "cover",
    padding: "inherit",
    marginTop: 4,
    textAlign: "start",
  },
  message: {
    color: "rgb(15, 20, 25)",
    margin: 10,
  },
  infoColor: {
    color: "#5B7083",
    fontSize: 15,
  },
};
class Screen extends Component {
  state = {
    showPollResult: false,
    open: false,
    extraData: [],
  };
  pollSelected = (event) => {
    try {
      var index = -1;

      if (event.target.getAttribute("index") !== null)
        index = event.target.getAttribute("index");
      else index = this.getIndexFromJsonArray(event.target.innerText);
    } catch (err) {}
    if (index !== -1) {
      this.props.addPollResponse(this.props.screen.screenId, {
        response: index,
      });
      this.setState({ showPollResult: true });
    }
  };
  getIndexFromJsonArray = (text) => {
    let index = 0;
    for (var i = 0; i < this.props.screen.polls.polls.length; i++) {
      if (this.props.screen.polls.polls[i].body.includes(text)) return index;
      index++;
    }
    return -1;
  };
  handleLikeCountClick = () => {
    console.log("like count clicked");
    this.setState({
      methodName: "Likes",
      actionMethod: this.props.getScreenLikes,
      open: true,
    });
  };
  openUserList = (methodName, actionMethod, extraData) => {
    console.log("openUserList, clicked");
    this.setState({ methodName, actionMethod, open: true, extraData });
  };
  handleClose = () => {
    this.setState({
      open: false,
      methodName: "",
      extraData: [],
      actionMethod: null,
    });
  };
  splitTheMessage = (message) => {
    let arr = message.split(" ");
    arr.forEach((element, index) => {});
    return arr;
  };
  render() {
    const {
      classes,
      screen: {
        body,
        createdAt,
        userImage,
        userHandle,
        screenId,
        likeCount,
        commentCount,
        screenMedia,
        polls,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
      screen,
    } = this.props;
    console.log(screenId, likeCount);
    dayjs.extend(relativeTime);
    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteScreen screenId={screenId} />
      ) : null;
    return (
      <React.Fragment>
        <Card variant="outlined">
          <div className={classes.content1}>
            <CardMedia
              image={userImage}
              title="Profile image"
              className={classes.image}
            />
            <CardContent style={{ width: "-webkit-fill-available" }}>
              <Typography
                variant="h6"
                color="primary"
                component={Link}
                to={`/user/${userHandle}`}
              >
                {userHandle}
              </Typography>
              {deleteButton}

              <Typography variant="body2" color="textSecondary">
                {dayjs(createdAt).fromNow()}
              </Typography>
            </CardContent>
          </div>
          <CardContent className={classes.content}>
            <Typography className={classes.message} variant="body1">
              {this.splitTheMessage(body).map((item) =>
                item.startsWith("#") ? (
                  <Typography
                    component={Link}
                    to={`/search/?type=hashtag&key=${item.replace("#", "")}`}
                  >
                    {" " + item}
                  </Typography>
                ) : (
                  " " + item
                )
              )}
            </Typography>

            {screenMedia && screenMedia.length > 0 && (
              <ScreenImage
                screenDetail={screen}
                screenId={screenId}
                width={this.props.width}
                userHandle={userHandle}
                openDialog={this.props.openScreenImageDialog}
              />
            )}
            {polls && Object.keys(polls).length > 0 && (
              <ShowPoll
                pollSelected={this.pollSelected}
                dayjs={dayjs}
                openUserList={this.openUserList}
                forecedShowPollResult={this.state.showPollResult}
                screenId={screenId}
                userHandle={userHandle}
                poll={polls}
              />
            )}

            <LikeButton screenId={screenId} key={screenId} />
            <span
              style={{ cursor: "pointer" }}
              onClick={this.handleLikeCountClick}
              className={classes.infoColor}
            >
              {likeCount} likes
            </span>
            <MyButton tip="comment">
              <Chat color="primary" />
            </MyButton>
            <span className={classes.infoColor}>{commentCount}</span>
            <ScreenDialog
              screenId={screenId}
              width={this.props.width}
              isHaveScreenMedia={screenMedia && screenMedia.length > 0}
              userHandle={userHandle}
              openDialog={this.props.openDialog}
            />
          </CardContent>
        </Card>
        {this.state.open && (
          <UserList
            method={this.state.methodName}
            open={this.state.open}
            actionMethod={this.state.actionMethod}
            actionValue={screenId}
            handleClose={this.handleClose}
            polls={this.state.extraData}
          />
        )}
      </React.Fragment>
    );
  }
}

Screen.propTypes = {
  user: PropTypes.object.isRequired,
  screens: PropTypes.object,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
  openScreenImageDialog: PropTypes.bool,
  addPollResponse: PropTypes.func,
  getScreenLikes,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default withWidth()(
  connect(mapStateToProps, { addPollResponse, getScreenLikes })(
    withStyles(styles)(Screen)
  )
);
