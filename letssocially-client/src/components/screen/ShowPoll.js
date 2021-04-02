import React, { Component } from "react";
import MyButton from "../../util/MyButton";
import { Link } from "react-router-dom";
import { Button, Divider, Grid, Paper, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { getScreenPollVoters } from "../../redux/actions/dataAction";
import { connect } from "react-redux";
import withStyle from "@material-ui/core/styles/withStyles";
import CheckCircleTwoToneIcon from "@material-ui/icons/CheckCircleTwoTone";
import UserList from "../profile/UserList";
const style = {
  btStyle: {
    marginLeft: -13,
  },
  margin: {
    marginLeft: 3,
    marginRight: 3,
  },
};
class ShowPoll extends Component {
  state = {
    response: -1,
    open: false,
    colors: ["#0084fd", "#369fffeb", "#75bcfdd9", "#b0d9ff"],
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  pollResponseGiven = () => {
    if (this.props.user.pollsResponse) {
      let index = this.props.user.pollsResponse.findIndex(
        (pollsResponse) => pollsResponse.screenId === this.props.screenId
      );
      if (index !== -1) {
        if (
          this.state.response !== this.props.user.pollsResponse[index].response
        )
          this.setState({
            response: this.props.user.pollsResponse[index].response,
          });

        return true;
      }
    }
    return null;
  };

  showUsers = () => {
    if (localStorage.handle === this.props.userHandle) {
      var pollData = [];
      this.props.poll.polls.forEach((item) => {
        pollData.push(item);
      });
      // this.setState({
      //   open: true,
      // });
      this.props.openUserList(
        "Votes",
        this.props.getScreenPollVoters,
        pollData
      );
    }
  };
  showPoll = (perVotes, pollJson, index) => {
    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <p className={this.props.classes.margin}>{perVotes}%</p>
          <Paper
            className={this.props.classes.margin}
            style={{
              height: "100%",
              width: `${perVotes}%`,
              //  marginTop: -12,
              backgroundColor: this.state.colors[index],
            }}
          >
            <span style={{ whiteSpace: "pre" }}> {pollJson.body}</span>
          </Paper>
          {this.state.response === index && (
            <CheckCircleTwoToneIcon
              fontSize="small"
              className={this.props.classes.margin}
              color="primary"
            />
          )}
        </div>
      </React.Fragment>
    );
  };
  render() {
    const { poll, forecedShowPollResult } = this.props;
    let pollData = [];
    let totalVotes = 0;
    if (poll.polls)
      Object.keys(poll.polls).length &&
        poll.polls.forEach((item) => {
          pollData.push(item);
          totalVotes += item.votes;
        });

    const showPollResult = pollData.map((pollJson, index) => {
      let perVotes =
        totalVotes === 0
          ? 0
          : Number((pollJson.votes / totalVotes) * 100).toFixed(0);
      return this.showPoll(perVotes, pollJson, index);
      /*<Grid container key={index} style={{ margin: 10 }}>
          <Grid item sm={1} xs={1} lg={1} justify="center" alignItems="center">
            <span>{perVotes}%</span>
          </Grid>
          <Grid item sm={1} xs={1} lg={1} style={{ textAlign: "center" }}>
            <span>
              {this.state.response === index && (
                <CheckCircleTwoToneIcon fontSize="small" color="primary" />
              )}
            </span>
          </Grid>
          <Grid item sm={10} xs={10} lg={8}>
            <Paper
              style={{
                width: perVotes === 100 ? "90%" : `${perVotes}%`,
                marginTop: -12,
                backgroundColor: this.state.colors[index],
              }}
            >
              <p style={{ whiteSpace: "pre" }}>{pollJson.body}</p>
            </Paper>
          </Grid>
        </Grid>*/
    });
    const pollsOptionMarkup = (
      <React.Fragment>
        {poll.pollsAttributes.pollsExpiry <= new Date().getTime() ? (
          showPollResult
        ) : (
          <div style={{ textAlign: "-webkit-center" }}>
            {pollData.map((data, index) => (
              <Button
                fullWidth
                variant="outlined"
                key={index}
                style={{
                  margin: 5,
                  width: "95%",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                index={index}
                color="primary"
                onClick={this.props.pollSelected}
              >
                {data.body}
              </Button>
            ))}
          </div>
        )}
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Paper variant="outlined">
          {this.pollResponseGiven() !== null
            ? showPollResult
            : pollsOptionMarkup}
          <Divider />
          <div style={{ margin: 10 }}>
            <span
              onClick={this.showUsers}
              style={
                localStorage.handle === this.props.userHandle
                  ? { cursor: "pointer", color: "#5B7083" }
                  : { color: "#5B7083" }
              }
            >
              {totalVotes} votes
            </span>
            <span
              style={{
                color: "#5B7083",
                margin: 5,
              }}
            >
              •
            </span>
            <span style={{ color: "#5B7083" }}>
              {poll.pollsAttributes.pollsExpiry >= new Date().getTime()
                ? `Expire ${this.props
                    .dayjs(poll.pollsAttributes.pollsExpiry)
                    .fromNow()}`
                : "Final Results"}
            </span>
          </div>
        </Paper>
        {/* {this.state.open && localStorage.handle === this.props.userHandle && (
          <UserList
            method={"Votes"}
            open={this.state.open}
            actionMethod={this.props.getScreenPollVoters}
            actionValue={this.props.screenId}
            handleClose={this.handleClose}
            polls={pollData}
          />
        )} */}
      </React.Fragment>
    );
  }
}
ShowPoll.propTypes = {
  user: PropTypes.object.isRequired,
  screenId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  getScreenPollVoters: PropTypes.func,
};
const mapStateToProps = (state) => ({
  user: state.user,
});
const mapActionToProps = {
  getScreenPollVoters,
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyle(style)(ShowPoll));
