import React, { Component, Fragment, useState } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";

//Mui
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import EditIcon from "@material-ui/icons/Edit";
import CalenderToday from "@material-ui/icons/CalendarToday";
import MuiLink from "@material-ui/core/Link";
import { Button, Grid, Typography } from "@material-ui/core";
import UserAccountDetails from "./UserAccountDetails";
import { followUser, unFollowUser } from "../../redux/actions/userAction";
import Alert from "../../util/Alert";
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
    marginTop: 10,
    display: "inline-block",
    textAlign: "left",
    marginBottom: 10,
  },
});

class StaticProfile extends Component {
  state = {
    isFollowing: this.props.profile && this.props.profile.is_following,
  };
  handleClick = () => {
    if (localStorage.getItem("handle") == null) window.location.href = "/login";
    else {
      if (!this.state.isFollowing)
        this.props.followUser(this.props.profile.handle);
      else this.props.unFollowUser(this.props.profile.handle);
      console.log("is following from click", this.state.isFollowing);

      this.setState({ isFollowing: !this.state.isFollowing });
    }
  };

  render() {
    var { classes, error, message } = this.props;
    console.log(this.props);
    var {
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
    } = this.props.data.user;
    console.log("width", this.props);
    console.log("message", message, error);
    const followButtonMarkUp =
      localStorage.getItem("handle") !== handle ? (
        <Button
          variant="outlined"
          fullWidth
          color="primary"
          onClick={this.handleClick}
        >
          {this.state.isFollowing ? "Following" : "Follow"}
        </Button>
      ) : null;
    return (
      <Fragment>
        <Paper className={classes.paper} variant={this.props.type}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageUrl} alt={handle} className="profile-image" />
            </div>
            <hr />
            <div className="profile-details">
              <Grid container>
                <Grid item xs={12}>
                  {
                    <Typography variant="h5" style={{ textAlign: "start" }}>
                      {username}
                    </Typography>
                  }
                </Grid>
                <Grid item xs={4}></Grid>
              </Grid>
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
                  {" "}
                  <hr />
                  <Typography variant="body2">{bio}</Typography>
                </React.Fragment>
              )}

              {location && (
                <Fragment>
                  <hr />
                  <LocationOn color="primary" className={classes.svgIcon} />
                  <span className={classes.spanArea}>{location}</span>
                </Fragment>
              )}

              {website && (
                <Fragment>
                  <br />
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
              <hr />
              <CalenderToday color="primary" className={classes.svgIcon} />
              <span className={classes.spanArea}>
                Joined {dayjs(createdAt).format("MMM YYYY")}{" "}
              </span>
              <hr />
              {followButtonMarkUp}
              <UserAccountDetails
                userHandle={handle}
                screenCount={total_screens}
                followersCount={followers}
                followingCount={following}
              />
            </div>
          </div>
        </Paper>
        {error && <Alert type="error" open={true} message={error} />}
        {message && <Alert type="success" open={true} message={message} />}
      </Fragment>
    );
  }
}

StaticProfile.propTypes = {
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  followUser: PropTypes.func.isRequired,
  unFollowUser: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
  data: state.data.user,
  error: state.data.error,
  message: state.data.message,
});
export default connect(mapStateToProps, { followUser, unFollowUser })(
  withStyles(styles)(StaticProfile)
);
