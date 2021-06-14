import {
  Card,
  CardMedia,
  CircularProgress,
  Dialog,
  Drawer,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { Component, Fragment } from "react";
import withStyle from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import { Close } from "@material-ui/icons";
import ImageViewer from "../../util/ImageViewer";
import ScreenBadge from "../../util/ScreenBadge";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getScreen, clearErrors } from "../../redux/actions/dataAction";
import Audio from "../layout/Audio";
import PlayCircleOutlineTwoToneIcon from "@material-ui/icons/PlayCircleOutlineTwoTone";

const drawerWidth = "60%";

const style = (theme) => ({
  boxImage: {
    height: 170,
    cursor: "pointer",
    display: "flex",
  },
  horizontalDivider: {
    borderColor: "#eff1f3",
    marginLeft: -17,
    marginRight: -17,
    marginTop: "auto",
    borderTop: "0px solid #eff1f3",
  },
  spinnerDiv: {
    textAlign: "center",
    margin: 50,
    marginBottom: 50,
  },
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
  },
  image: {
    height: "-webkit-fill-available",
    objectFit: "contain",
    maxWidth: "-webkit-fill-available",
    maxHeight: "-webkit-fill-available",
  },
  closeButton: {
    float: "right",
    // position: "absolute",
    zIndex: "inherit",
    position: "fixed",
    marginTop: "-90vh",
  },
  scroll: {
    flexGrow: 1,
    overflow: "auto",
    minHeight: "100%",
  },
  imageCount: {
    height: 171.4,
    position: "absolute",
    zIndex: 1,
    width: "15%",
    marginTop: "-15.42%",
    backgroundColor: "#00000045",
    marginLeft: "11.7%",
  },
  imageCountNumber: {
    marginTop: "32%",
    color: "white",
    marginRight: "40%",
    float: "right",
    fontSize: "xx-large",
  },
  card: {
    // marginRight: "3%",
    marginTop: "1em",
  },

  root: {
    display: "flex",
    height: "-webkit-fill-available",
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  drawerPaper: {
    backgroundColor: "transparent",
    width: drawerWidth,
    placeContent: "center",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    height: "fit-content",
    flexGrow: 1,

    paddingBottom: "33em",
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  playIcon: {
    left: "50%",
    margin: "-64px 0 0 -64px",
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
});
class ScreenImage extends Component {
  state = {
    open: false,
    oldPath: "",
    newPath: "",
    sizes: { one: [12], two: [6, 6], three: [12, 6, 6], four: [6, 6, 6, 6] },
  };
  componentDidMount() {
    if (this.props.openScreenImageDialog) this.handleOpen();
  }
  handleOpen = () => {
    let oldPath = window.location.pathname;
    const { userHandle, screenId } = this.props;
    const newPath = `/user/${userHandle}/screen/${screenId}`;
    if (oldPath === newPath) oldPath = `/user/${userHandle}`;
    window.history.pushState(null, null, newPath);
    this.setState({
      open: true,
      oldPath,
      newPath,
    });
    if (this.props.width !== "xs") this.props.getScreen(this.props.screenId);
  };
  handleClose = () => {
    window.history.pushState(null, null, this.state.oldPath);
    this.setState({
      open: false,
    });
    this.props.clearErrors();
  };
  getSizeArray = (media) => {
    if (media.length === 1) return this.state.sizes.one;
    else if (media.length === 2) return this.state.sizes.two;
    else if (media.length === 3) return this.state.sizes.three;
    else return this.state.sizes.four;
  };
  render() {
    const {
      classes,
      screenDetail,
      screenId,
      screen: { likeCount, commentCount, comments, screenMedia },
      UI: { loading },
    } = this.props;
    let show = screenMedia ? screenMedia.length > 4 : null;
    let audioList = [];
    let mediaList = [];
    if (screenDetail.screenMedia)
      screenDetail.screenMedia.map((item) => {
        if (item.includes(".mp3")) audioList.push(item);
        else mediaList.push(item);
      });
    const audioMediaMarkup =
      screenDetail.screenMedia &&
      audioList.map((item, index) => <Audio uri={item} key={index} />);
    const screenMediaMarkup =
      screenDetail.screenMedia &&
      mediaList.map((item, index) => {
        let sizeArray = this.getSizeArray(mediaList);
        const style =
          index % 2 === 0 ? { paddingRight: 1 } : { paddingLeft: 1 };
        return index < 4 ? (
          <Grid item xs={sizeArray[index]} style={style}>
            <CardMedia
              id={`${screenId}_${index}`}
              image={
                item.includes(".mp4")
                  ? item
                      .replace(
                        item.substring(
                          item.indexOf("/o/") + 3,
                          item.indexOf("?")
                        ),
                        item.substring(
                          item.indexOf("/o/") + 3,
                          item.indexOf("?") - 4
                        ) + "_preview.png"
                      )
                      .replace("video", "preview")
                  : item
              }
              key={index}
              className={classes.boxImage}
              title={screenDetail.userHandle}
              onClick={this.handleOpen}
            >
              {item.includes("mp4") && (
                <PlayCircleOutlineTwoToneIcon
                  fontSize="large"
                  style={{
                    color: "#ffffffc4",
                    fontSize: "4em",
                    margin: "auto",
                  }}
                />
              )}
            </CardMedia>

            {show && index === 3 && (
              <div className={classes.imageCount}>
                <Typography className={classes.imageCountNumber}>
                  +{screenMedia.length - 4}
                </Typography>
              </div>
            )}
          </Grid>
        ) : null;
      });
    const screenMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={50} thickness={2} />
      </div>
    ) : (
      <Fragment>
        <hr className={classes.horizontalDivider} />
        <CommentForm screenId={screenId} />
        <Comments comments={comments} />
      </Fragment>
    );
    return (
      <Fragment>
        <Grid container>{audioMediaMarkup}</Grid>
        {mediaList.length > 0 && (
          <Card variant="outlined" className={classes.card}>
            <Grid container>{screenMediaMarkup}</Grid>
          </Card>
        )}
        {/* <ScreenMediaDialog
          handleClose={this.handleClose}
          loading={loading}
          classes={classes}
          screen={screen}
        /> */}
        <Dialog
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
          className={classes.root}
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <div className={classes.root}>
            <Drawer
              className={classes.drawer}
              variant="permanent"
              classes={{
                paper: classes.drawerPaper,
              }}
              anchor="left"
            >
              <MyButton
                tip="Close"
                onClick={this.handleClose}
                tipClassName={classes.closeButton}
                btnClassName={classes.closeButton}
              >
                <Close htmlColor="#ffffff" />
              </MyButton>
              <ImageViewer
                images={mediaList}
                className={classes.image}
                imageContent={classes.imageContent}
                playIconClassName={classes.playIcon}
              />
            </Drawer>
            <div className={classes.content}>
              <ScreenBadge
                screen={this.props.screenDetail}
                newLike={likeCount}
                newComent={commentCount}
              />
              {screenMarkup}
              <Typography style={{ visibility: "hidden" }}>
                suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
                suspendisse suspendisse suspendisse suspendisse suspendisse
                suspendisse suspendisse suspendisse suspendisse suspendisse
                suspendisse suspendisse suspendisse sed nisi lacus sed viverra
                tellus. Purus sit amet suspendisse suspendisse suspendisse
                suspendisse suspendisse suspendisse suspendisse suspendisse
                suspendisse suspendisse suspendisse suspendisse
              </Typography>
            </div>
          </div>
        </Dialog>
      </Fragment>
    );
  }
}

ScreenImage.propTypes = {
  getScreen: PropTypes.func.isRequired,
  screenId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  screen: PropTypes.object.isRequired,
  screenDetail: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  screen: state.data.screen,
  UI: state.UI,
});
const mapActionToProps = {
  getScreen,
  clearErrors,
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyle(style)(ScreenImage));
