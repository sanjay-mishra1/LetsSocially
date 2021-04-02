import React, { Component } from "react";
import MyButton from "../../util/MyButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { likeScreen, unlikeScreen } from "../../redux/actions/dataAction";
import { connect } from "react-redux";
import withStyle from "@material-ui/core/styles/withStyles";
const style = {
  btStyle: {
    marginLeft: -13,
  },
};
class LikeButton extends Component {
  likedScreen = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screenId === this.props.screenId
      )
    )
      return true;
    else return false;
  };
  likeScreen = () => {
    this.props.likeScreen(this.props.screenId);
  };
  unlikeScreen = () => {
    this.props.unlikeScreen(this.props.screenId);
  };
  render() {
    const { authenticated } = this.props.user;
    const { classes } = this.props;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="like" btnClassName={classes.btStyle}>
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.likedScreen() ? (
      <MyButton
        tip="unlike screen"
        btnClassName={classes.btStyle}
        onClick={this.unlikeScreen}
      >
        <Favorite color="primary" />
      </MyButton>
    ) : (
      <MyButton
        tip="like screen"
        onClick={this.likeScreen}
        btnClassName={classes.btStyle}
      >
        <FavoriteBorder color="primary" />
      </MyButton>
    );
    return likeButton;
  }
}
LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screenId: PropTypes.string.isRequired,
  likeScreen: PropTypes.func.isRequired,
  unlikeScreen: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.user,
});
const mapActionToProps = {
  likeScreen,
  unlikeScreen,
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyle(style)(LikeButton));
