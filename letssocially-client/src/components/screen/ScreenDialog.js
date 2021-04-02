import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

//redux
import { getScreen, clearErrors } from "../../redux/actions/dataAction";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  withStyles,
} from "@material-ui/core";
import MyButton from "../../util/MyButton";
import { Chat, Close, UnfoldMore } from "@material-ui/icons";
import dayjs from "dayjs";
import LikeButton from "../screen/LikeButton";
import ScreenImage from "./ScreenImage";
import ShowPoll from "./ShowPoll";
const styles = (theme) => ({
  ...theme.spreadIt,

  profileImage: {
    maxWidth: 200,
    height: 60,
    width: 60,
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    left: "90%",
  },
  expandButton: {
    float: "right",
  },
  spinnerDiv: {
    textAlign: "center",
    margin: 50,
    marginBottom: 50,
  },
});
class ScreenDialog extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: "",
  };
  componentDidMount() {
    if (this.props.openDialog) this.handleOpen();
  }

  handleOpen = () => {
    const { userHandle, screenId } = this.props;
    if (this.props.isHaveScreenMedia && this.props.width !== "xs") {
      document.getElementById(`${screenId}_0`).click();
      return;
    }
    let oldPath = window.location.pathname;
    const newPath = `/user/${userHandle}/screen/${screenId}`;
    if (oldPath === newPath) oldPath = `/user/${userHandle}`;
    window.history.pushState(null, null, newPath);

    this.setState({
      open: true,
      oldPath,
      newPath,
    });
    this.props.getScreen(this.props.screenId);
  };
  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({
      open: false,
    });
    this.props.clearErrors();
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
  render() {
    const {
      classes,

      UI: { loading },
    } = this.props;
    const {
      screen,
      screen: {
        screenId,
        body,
        createdAt,
        likeCount,
        commentCount,
        userImage,
        userHandle,
        comments,
        screenMedia,
        polls,
      },
    } = this.props.data;
    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={50} thickness={2} />
      </div>
    ) : (
      <Grid container>
        <Grid item>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item xs={9} lg={9} sm={9}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/user/${userHandle}`}
          >
            @{userHandle}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.invisibleSeparator} />
          {body &&
            body.split(" ").map((item) =>
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
          {polls && Object.keys(polls).length > 0 && (
            <ShowPoll
              pollSelected={this.pollSelected}
              dayjs={dayjs}
              forecedShowPollResult={this.state.showPollResult}
              screenId={screenId}
              userHandle={userHandle}
              poll={polls}
            />
          )}
          {screenMedia && screenMedia.length > 0 && (
            <ScreenImage
              screenDetail={screen}
              screenId={screenId}
              userHandle={userHandle}
              openDialog={this.props.openScreenImageDialog}
            />
          )}
          <LikeButton screenId={screenId} key={screenId} />
          <span>{likeCount} Likes</span>
          <MyButton tip="comment">
            <Chat color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
        </Grid>

        <CommentForm screenId={screenId} />
        <Comments comments={comments} />
      </Grid>
    );

    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="Expand screen"
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          fullScreen={this.props.width === "xs"}
          maxWidth={this.props.width === "xs" ? false : "sm"}
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <Close />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

ScreenDialog.propTypes = {
  getScreen: PropTypes.func.isRequired,
  screenId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  screen: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  data: state.data,
  UI: state.UI,
});
const mapActionToProps = {
  getScreen,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(ScreenDialog));
