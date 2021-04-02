import { Dialog, Divider, Grid, withWidth } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component, Fragment } from "react";
import UserList from "./UserList";
import {
  getFollowersList,
  getFollowingList,
} from "../../redux/actions/dataAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";
const style = {
  subTitle: {
    color: "#8E8E8E",
    fontSize: 14,
  },
  itemStyle: {
    cursor: "pointer",
  },
};
class UserAccountDetails extends Component {
  state = {
    open: false,
    width: "lg",
    method: "",
    actionMethod: null,
  };
  handleClose = () => {};
  openFollowingList = () => {
    if (this.props.followingCount && this.props.followingCount !== 0)
      this.setState({
        open: true,
        method: "Following",
        actionMethod: this.props.getFollowingList,
      });
  };
  openFollowersList = () => {
    if (this.props.followersCount !== 0)
      this.setState({
        open: true,
        method: "Followers",
        actionMethod: this.props.getFollowersList,
      });
  };
  handleClose = () => {
    this.setState({
      method: "",
      open: false,
    });
  };
  render() {
    const {
      classes,
      userHandle,
      followersCount,
      followingCount,
      screenCount,
    } = this.props;
    console.log(this.props);
    return (
      <Fragment>
        <Divider style={{ marginLeft: -20, marginRight: -20, marginTop: 10 }} />
        <Grid container style={{ textAlign: "center" }}>
          <Grid item xs={4}>
            <span>{screenCount ? screenCount : 0}</span>
            <br />
            <span className={classes.subTitle}>screen</span>
          </Grid>
          <Grid item xs={4}>
            <div style={{ cursor: "pointer" }} onClick={this.openFollowersList}>
              <span>{followersCount ? followersCount : 0}</span>
              <br />
              <span className={classes.subTitle}>followers</span>
            </div>
          </Grid>
          <Grid
            item
            xs={4}
            className={classes.itemStyle}
            onClick={this.openFollowingList}
          >
            <span>{followingCount ? followingCount : 0}</span>
            <br />
            <span className={classes.subTitle}>following</span>
          </Grid>
        </Grid>
        {this.state.method !== "" && (
          <UserList
            method={this.state.method}
            open={this.state.open}
            showBt
            defaultText={
              this.state.method === "Followers" ? "Follow" : "UnFollow"
            }
            actionMethod={this.state.actionMethod}
            userHandle={userHandle}
            actionValue={userHandle}
            handleClose={this.handleClose}
          />
        )}
      </Fragment>
    );
  }
}
UserAccountDetails.propTypes = {
  getFollowersList: PropTypes.func,
  getFollowingList: PropTypes.func,
};
export default withWidth()(
  connect(null, { getFollowersList, getFollowingList })(
    withStyles(style)(UserAccountDetails)
  )
);
