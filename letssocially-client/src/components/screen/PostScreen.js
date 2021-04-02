import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
//MUI stuff
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import withWidth from "@material-ui/core/withWidth";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  TextField,
  withStyles,
} from "@material-ui/core";

import {
  postScreen,
  postScreenWithMedia,
  clearErrors,
  addScreen,
} from "../../redux/actions/dataAction";
import {
  Add,
  AudiotrackRounded,
  AudiotrackTwoTone,
  Close,
  EmojiEmotions,
  InsertPhoto,
  InsertPhotoTwoTone,
  LocationOn,
  Movie,
  MovieTwoTone,
  PollTwoTone,
} from "@material-ui/icons";
import MyButton from "../../util/MyButton";
import MediaPreview from "../../util/MediaPreview";
import AddPolls from "./AddPolls";
const styles = (theme) => ({
  ...theme.spreadIt,
  submitButton: {
    position: "relative",
    float: "right",
  },
  progressSpinner: {
    position: "absolute",
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    top: "4%",
  },
  bt: {
    marginLeft: "auto",
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  polls: {
    maxWidth: "75%",
    marginTop: 20,
    marginBottom: 20,
  },
});
class PostScreen extends Component {
  state = {
    open: false,
    body: "",
    polls: [],
    pollsType: "Everyone can reply",
    pollsExpiry: [0, 0, 0],
    files: [],
    errors: {},
    type: "",
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors,
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading && this.state.body) {
      // this.setState({ body: "", open: false, errors: {} });
      this.handleClose();
    }
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    // this.setState({ open: false, errors: {} });
    this.setState({
      body: "",
      open: false,
      errors: {},
      files: [],
      polls: [],
      pollsExpiry: [0, 0, 0],
    });
    this.props.clearErrors();
  };
  componentDidMount() {
    console.log("did mount visisble");
  }
  handleChange = (event) => {
    let value = event.target.value;

    this.setState({ [event.target.name]: value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    let data = {};
    if (this.state.files && this.state.files.length > 0) {
      data.files = this.state.files.map((item) => item.blob);
      data.filename = this.state.files.map((item) => item.finalName);
    }
    if (this.state.polls.length > 0) {
      data.polls = this.state.polls;
      data.pollsAttributes = {
        pollsType: this.state.pollsType,
        pollsExpiry: this.state.pollsExpiry,
      };
    }
    data.body = this.state.body;
    return this.props.addScreen(data);
  };
  removeMedia = (e) => {
    let index = e.target.getAttribute("index");
    if (index.includes("-preview")) {
      let i = index.split("-")[0];
      this.state.files.splice(i, 1);
      index = i;
      index--;
    }
    this.state.files.splice(index, 1);
    this.setState({ files: this.state.files });
    console.log("after media remove", this.state.files);
  };
  handleFileSelection = (event) => {
    try {
      const input = event.target.files[0];
      console.log("file", event, "input ", input);
      let url = URL.createObjectURL(input);
      const name = `${Math.round(Math.random() * 100000)}`;
      if (input.type === "video/mp4")
        this.setPreview(input, input.name, name, this);
      let file = {
        name: input.name,
        uri: url,
        blob: input,
        finalName: name,
        type: input.type,
      };
      if (input.type === "audio/mpeg") this.state.files.unshift(file);
      else this.state.files.push(file);
      this.setState({ files: this.state.files });
    } catch (err) {}
  };
  setPreview = async (file, filename, previewName, object) => {
    console.log("loading preview", file);
    let videoMetaData = (file) => {
      return new Promise(function (resolve, reject) {
        let video = document.getElementById("video");

        // video.preload = 'metadata';

        video.addEventListener("canplay", function () {
          resolve({
            video: video,
            duration: Math.round(video.duration * 1000),
            height: video.videoHeight,
            width: video.videoWidth,
          });
        });

        video.src = URL.createObjectURL(file);

        document.body.appendChild(video);

        video.play();
        setTimeout(function () {
          video.pause();
        }, 2000);
      });
    };

    return videoMetaData(file).then(function (value) {
      let videoCanvas = document.createElement("canvas");

      videoCanvas.height = value.height;
      videoCanvas.width = value.width;
      videoCanvas.getContext("2d").drawImage(value.video, 0, 0);
      var snapshot = videoCanvas.toDataURL("image/png");
      let file = {
        name: `${filename}`,
        uri: snapshot,
        blob: snapshot,
        finalName: previewName + "_preview",
        type: "image/png",
      };
      object.state.files.push(file);
      object.setState({ files: object.state.files });
    });
  };

  handleImageClick = (e) => {
    this.activateMediaSelector("image/*");
  };
  handleVideoClick = (e) => {
    this.activateMediaSelector("video/*");
  };
  handleAudioClick = (e) => {
    this.activateMediaSelector("audio/*");
  };
  removePolls = () => {
    console.log("Handle polls click clicked", this.state.polls.length);
    this.setState({ polls: [] });
    console.log("new state", this.state);
  };
  handleChangeInPollsExpiry = (value, index) => {
    let arr = this.state.pollsExpiry;
    arr[index] = parseInt(value);
    this.setState({ pollsExpiry: arr });
    console.log(this.state);
  };
  handlePollsType = (type) => {
    this.setState({ pollsType: type });
  };
  addPolls = () => {
    var option = this.state.polls;
    option.push("");
    this.setState({ polls: option });
  };
  handlePollOptionTextChange = (event) => {
    console.log("id", event.target.getAttribute("id"));
    let index = event.target.getAttribute("id");
    var option = this.state.polls;
    option[parseInt(index)] = event.target.value;
    this.setState({
      polls: option,
    });
  };
  activateMediaSelector = (type) => {
    const fileInput = document.getElementById("file");
    console.log("file type is", type);
    fileInput.accept = type;
    fileInput.click();
  };
  handlePollsClick = () => {
    console.log("Handle polls click clicked", this.state.polls.length);
    if (this.state.polls.length === 0) this.setState({ polls: ["", ""] });
  };
  render() {
    const { errors } = this.state;

    const {
      classes,
      smallScreen,
      UI: { loading },
    } = this.props;
    const buttonMarkup = !smallScreen ? (
      <MyButton
        onClick={this.handleOpen}
        tip="Post a screen!"
        btnClassName={classes.bt}
      >
        <Add htmlColor="#ffffff" />
      </MyButton>
    ) : (
      <Fab
        color="primary"
        aria-label="add"
        onClick={this.handleOpen}
        className={classes.fab}
        style={{ zIndex: 10 }}
      >
        <Add />
      </Fab>
    );
    return (
      <Fragment>
        {buttonMarkup}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth={this.props.width === "xs" ? null : "sm"}
          fullScreen={this.props.width === "xs"}
        >
          <div style={{ display: "flex" }}>
            <MyButton tip="Close" onClick={this.handleClose}>
              <Close />
            </MyButton>
            <DialogTitle>Post a new screen</DialogTitle>
          </div>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name="body"
                type="text"
                label="SCREEN"
                multiline
                rows="3"
                placeholder="What's in your mind"
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              {this.state.files && (
                <MediaPreview
                  removeMedia={this.removeMedia}
                  files={this.state.files}
                />
              )}
              {this.state.polls.length > 0 && (
                <AddPolls
                  pollonRemove={this.removePolls}
                  pollonAdd={this.addPolls}
                  polls={this.state.polls}
                  pollsClass={classes.polls}
                  handlePollsType={this.handlePollsType}
                  pollsType={this.state.pollsType}
                  handleChangeInPollsExpiry={this.handleChangeInPollsExpiry}
                  handleChange={this.handlePollOptionTextChange}
                />
              )}
              <Grid container>
                <Grid item xs={2}>
                  <MyButton onClick={this.handleImageClick} tip="Add photo">
                    <InsertPhotoTwoTone color="primary" />
                  </MyButton>
                </Grid>
                <Grid item xs={2}>
                  <MyButton onClick={this.handleVideoClick} tip="Add video">
                    <MovieTwoTone color="primary" />
                  </MyButton>
                </Grid>

                <Grid item xs={2}>
                  <MyButton onClick={this.handleAudioClick} tip="Add audio">
                    <AudiotrackTwoTone color="primary" />
                  </MyButton>
                </Grid>
                <Grid item xs={2}>
                  <MyButton onClick={this.handlePollsClick} tip="Add poll">
                    <PollTwoTone color="primary" />
                  </MyButton>
                </Grid>
              </Grid>
              <input
                type="file"
                id="file"
                onChange={this.handleFileSelection}
                hidden="hidden"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Submit
                {loading && (
                  <CircularProgress
                    size={30}
                    className={classes.progressSpinner}
                  />
                )}
              </Button>
            </form>
            <video id="video" width="420" muted style={{ display: "none" }}>
              <source />
            </video>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostScreen.propTypes = {
  postScreen: PropTypes.func.isRequired,
  postScreenWithMedia: PropTypes.func.isRequired,
  addScreen: PropTypes.func,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
});

export default withWidth()(
  connect(mapStateToProps, {
    postScreen,
    clearErrors,
    postScreenWithMedia,
    addScreen,
  })(withStyles(styles)(PostScreen))
);
