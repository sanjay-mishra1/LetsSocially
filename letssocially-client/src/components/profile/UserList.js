import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";

//redux
import {
  getFollowersList,
  getFollowingList,
  clearErrors,
} from "../../redux/actions/dataAction";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  withStyles,
  withWidth,
} from "@material-ui/core";
import MyButton from "../../util/MyButton";
import { Close, PollTwoTone } from "@material-ui/icons";
import SmallProfile from "../profile/SmallProfile";
const styles = (theme) => ({
  ...theme.spreadIt,

  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    marginTop: 10,
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
class UserList extends Component {
  componentDidMount() {
    this.props.actionMethod(this.props.actionValue);
  }
  render() {
    const {
      classes,
      users,
      UI: { loading },
    } = this.props;
    console.log(this.props);
    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress size={30} thickness={2} />
      </div>
    ) : users && users.length > 0 ? (
      users.map((item, index) => {
        let extraData;
        if (item.polls && item.hasOwnProperty("response")) {
          extraData = (
            <React.Fragment>
              <table>
                <tr>
                  <td>
                    <PollTwoTone color="primary" />
                  </td>
                  <td>
                    <span>
                      {" "}
                      selected {this.props.polls[item.response].body}
                    </span>
                  </td>
                </tr>
              </table>
            </React.Fragment>
          );
        }
        return (
          <SmallProfile
            defaultText={this.props.defaultText}
            key={index}
            showBt={this.props.showBt}
            extraData={extraData}
            user={item}
          />
        );
      })
    ) : (
      <p>No {this.props.method.toLowerCase()} found</p>
    );
    return (
      <Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          fullScreen={this.props.width === "sm" || this.props.width === "xs"}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <MyButton
            tip="Close"
            onClick={this.props.handleClose}
            tipClassName={classes.closeButton}
          >
            <Close />
          </MyButton>
          <DialogTitle id="responsive-dialog-title">
            {this.props.method}
          </DialogTitle>

          <DialogContent dividers className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

UserList.propTypes = {
  getFollowersList: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  clearErrors: PropTypes.func.isRequired,
  getFollowingList: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  users: state.data.usersList,
  UI: state.UI,
});
const mapActionToProps = {
  getFollowersList,
  clearErrors,
  getFollowingList,
};

export default withWidth()(
  connect(mapStateToProps, mapActionToProps)(withStyles(styles)(UserList))
);
