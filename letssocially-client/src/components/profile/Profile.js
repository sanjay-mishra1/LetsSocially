import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ProfileSkeleton from "../../util/ProfileSkeleton";

//MUI stiff
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { Paper, Typography } from "@material-ui/core";
import MuiLink from "@material-ui/core/Link";
import EditDetails from "../profile/EditDetails";
//ICONS
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import EditIcon from "@material-ui/icons/Edit";
import { KeyboardReturn } from "@material-ui/icons";
import CalenderToday from "@material-ui/icons/CalendarToday";
//Redux
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { logoutUser, uploadImage } from "../../redux/actions/userAction";
import MyButton from "../../util/MyButton";
import UserAccountDetails from "./UserAccountDetails";
const styles = (theme) => ({
  ...theme.spreadIt,
  svgIcon: {
    float: "left",
    marginTop: 6,
  },
  spanArea: {
    width: "79%",
    height: 18,
    marginStart: "10px",
    marginTop: 6,
    display: "inline-block",
    textAlign: "left",
    marginBottom: 10,
  },
});
class Profile extends Component {
  handleImageChange = (event) => {
    const imageInput = event.target.files[0];
    //send profile image to server
    const formData = new FormData();
    formData.append("image", imageInput, imageInput.name);
    this.props.uploadImage(formData);
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById("imageId");
    fileInput.click();
  };
  handleLogout = () => {
    this.props.logoutUser();
  };
  render() {
    console.log(this.props);
    const {
      classes,

      data: { loading },
      user: { authenticated },
    } = this.props;
    const {
      user: {
        handle,
        username,
        createdAt,
        imageUrl,
        bio,
        website,
        location,
        followers,
        following,
        total_screens,
      },
    } = this.props.data.user;
    console.log("Profile", this.props.data.user, loading);
    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper} variant={this.props.type}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img
                src={imageUrl}
                alt={{ handle } + "-image"}
                className="profile-image"
              />
              <input
                type="file"
                id="imageId"
                onChange={this.handleImageChange}
                hidden="hidden"
              />
              <MyButton
                tip="Edit profile picture"
                onClick={this.handleEditPicture}
                btnClassName="button"
              >
                <EditIcon color="primary" />
              </MyButton>
            </div>
            <hr />
            <div className="profile-details">
              {<Typography variant="h5">{username}</Typography>}
              <MuiLink
                component={Link}
                to={`/user/${handle}`}
                color="primary"
                variant="subtitle2"
              >
                @{handle}
              </MuiLink>

              {bio && (
                <React.Fragment>
                  <hr /> <Typography variant="body2">{bio}</Typography>
                </React.Fragment>
              )}

              {location && (
                <Fragment>
                  <hr />
                  <LocationOn color="primary" className={classes.svgIcon} />
                  <span className={classes.spanArea}>{location}</span>
                </Fragment>
              )}
              <br />
              {website && (
                <Fragment>
                  <LinkIcon color="primary" className={classes.svgIcon} />
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.spanArea}
                  >
                    {website}
                  </a>
                  <br />
                </Fragment>
              )}
              <CalenderToday color="primary" className={classes.svgIcon} />
              <span className={classes.spanArea}>
                Joined {dayjs(createdAt).format("MMM YYYY")}{" "}
              </span>
              <UserAccountDetails
                userHandle={handle}
                screenCount={total_screens}
                followersCount={followers}
                followingCount={following}
              />
            </div>

            <MyButton
              tip="Logout"
              btId="logoutBt"
              onClick={this.handleLogout}
              btnClassName={classes.hiddenBt}
            >
              <KeyboardReturn color="primary" />
            </MyButton>
            <EditDetails />
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            No profile found, please login again
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/signup"
              >
                Signup
              </Button>
            </div>
          </Typography>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    );
    return profileMarkup;
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user,
});
Profile.propTypes = {
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};
const mapActionsToProps = { logoutUser, uploadImage };
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
