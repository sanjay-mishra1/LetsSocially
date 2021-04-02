import React from "react";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";

import NoImg from "../images/no-image.png";

//MUI icons
import Paper from "@material-ui/core/Paper";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalenderToday from "@material-ui/icons/CalendarToday";

const styles = (theme) => ({
  ...theme.spreadIt,
  handle: {
    height: 20,
    backgroundColor: theme.palette.primary.main,
    width: 60,
    margin: "0px auto 7px auto",
  },
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
    marginBottom: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  fullLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
    marginBottom: 10,
  },
  halfLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "50%",
    marginBottom: 10,
  },
});
const ProfileSkeleton = (props) => {
  const { classes } = props;

  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={NoImg} alt="profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
          <div className={classes.handle} />
          <hr />
          <div className={classes.fullLine} />
          <div className={classes.halfLine} />
          <hr />
          <LocationOn className={classes.svgIcon} color="primary" />
          <span className={classes.spanArea}></span>
          <br />
          <LinkIcon className={classes.svgIcon} color="primary" />
          <span className={classes.spanArea}></span>
          <br />
          <CalenderToday className={classes.svgIcon} color="primary" />
          <span className={classes.spanArea}></span>
        </div>
      </div>
    </Paper>
  );
};

ProfileSkeleton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileSkeleton);
