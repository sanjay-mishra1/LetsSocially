import { Grid, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import withStyle from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
//Redux
import store from "../../redux/store";
import { SEARCH_ACTIVE } from "../../redux/type";
import FollowButton from "./FollowButton";
import { useHistory } from "react-router-dom";
const styles = (theme) => ({
  ...theme.spreadIt,
  image: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    objectFit: "cover",
  },
});

const SmallProfile = (props) => {
  let history = useHistory();

  const handleClick = () => {
    store.dispatch({ type: SEARCH_ACTIVE });
    console.log("clicked");
    // window.location.href = `/user/${props.user.userHandle}`;
    history.push(`/user/${props.user.userHandle}`);
  };
  const {
    classes,
    vertical,
    extraData,
    defaultText,
    user: { userHandle, username, userImage, type },
  } = props;

  return (
    <Fragment>
      <Grid
        justify="flex-start"
        alignItems="flex-start"
        alignContent="flex-start"
        spacing={1}
        style={vertical ? { justifyContent: "center" } : null}
        className={classes.link}
        container
        onClick={handleClick}
      >
        <Grid item>
          {vertical && <br />}

          <img src={userImage} alt={userHandle} className={classes.image} />
        </Grid>

        <Grid
          item
          xs={vertical ? 12 : "auto"}
          style={vertical ? { textAlign: "center" } : null}
        >
          <Typography style={{ marginTop: "auto" }} className={classes.title}>
            {userHandle}
          </Typography>
          <Typography className={classes.subTitle}>{username}</Typography>
          {extraData}
        </Grid>
        {props.showBt && userHandle !== localStorage.handle && (
          <Grid item style={{ margin: "auto" }}>
            <FollowButton defaultText={defaultText} userHandle={userHandle} />
            {vertical && <p></p>}
          </Grid>
        )}
      </Grid>
      {!vertical && <hr className={classes.horizontalDivider} />}
    </Fragment>
  );
};
SmallProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

/*class SmallProfile extends Component {
  handleClick = () => {
    store.dispatch({ type: SEARCH_ACTIVE });
    console.log("clicked");
    window.location.href = `/user/${this.props.user.userHandle}`;
  };
  render() {
    const {
      classes,
      vertical,
      extraData,
      user: { userHandle, username, userImage, type },
    } = this.props;
    return (
      <Fragment>
        <Grid
          justify="flex-start"
          alignItems="flex-start"
          alignContent="flex-start"
          spacing={1}
          style={vertical ? { justifyContent: "center" } : null}
          className={classes.link}
          container
          onClick={this.handleClick}
        >
          <Grid item>
            {vertical && <br />}

            <img src={userImage} alt={userHandle} className={classes.image} />
          </Grid>

          <Grid
            item
            xs={vertical ? 12 : "auto"}
            style={vertical ? { textAlign: "center" } : null}
          >
            <Typography style={{ marginTop: "auto" }} className={classes.title}>
              {userHandle}
            </Typography>
            <Typography className={classes.subTitle}>{username}</Typography>
            {extraData}
          </Grid>
          {this.props.showBt && (
            <Grid item style={{ margin: "auto" }}>
              <FollowButton />
              {vertical && <p></p>}
            </Grid>
          )}
        </Grid>
        {!vertical && <hr className={classes.horizontalDivider} />}
      </Fragment>
    );
  }
}
SmallProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};*/
export default withStyle(styles)(SmallProfile);
