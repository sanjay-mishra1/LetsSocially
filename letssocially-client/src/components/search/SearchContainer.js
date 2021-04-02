import { Card, CardContent, Divider, Typography } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import SmallProfile from "../profile/SmallProfile";
import MuiLink from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import withStyle from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Screen from "../screen/Screen";

const styles = (theme) => ({
  ...theme.spreadIt,
  search: {
    marginRight: theme.spacing(2),
    marginLeft: 0,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
    },
  },
});
class SearchContainer extends Component {
  handleClick = () => {
    const query = document.getElementById("search").value;
    window.location.href = `/search/?type=handle&key=${query}`;
  };
  showContainer = () => {
    if (
      (this.props.from === "page" &&
        window.location.pathname.includes("/search")) ||
      (this.props.from === "nav" &&
        !window.location.pathname.includes("/search"))
    )
      return true;
    else return false;
  };
  seeMoreMarkup = () => {
    if (this.props.from === "nav") {
      return (
        <div className={this.props.classes.link} onClick={this.handleClick}>
          <Typography onClick={this.handleClick} variant="subtitle2">
            See more
          </Typography>
        </div>
      );
    } else console.log("not showing see more since from is ", this.props.from);
  };
  getTypeContainer = (user, index) => {
    if (user.type === "users") return <SmallProfile key={index} user={user} />;
    else if (user.type === "screens")
      return (
        <Screen
          history={this.props.history}
          screen={user}
          key={user.screenId}
        />
      );
  };
  render() {
    const { searchResult } = this.props.data;
    const {
      classes,
      from,
      customStyle,
      UI: { searchActive, searchInactive },
    } = this.props;
    console.log("from", this.props);

    const searchMarkup = searchResult
      ? searchResult.map((user, index) => this.getTypeContainer(user, index))
      : null;
    return (
      <Fragment>
        {searchActive && searchResult && searchResult.length > 0 && (
          <Card
            variant="outlined"
            className={classes.searchResultContainer}
            style={customStyle}
          >
            <CardContent>
              {this.props.from !== "nav" && searchResult && (
                <React.Fragment>
                  <p style={{ marginTop: 0 }}>
                    Found {searchResult.length} results{" "}
                  </p>
                  <Divider
                    style={{
                      marginLeft: -16,
                      marginBottom: 10,
                      marginRight: -16,
                    }}
                  />
                </React.Fragment>
              )}
              {searchMarkup}
              {this.seeMoreMarkup()}
            </CardContent>
          </Card>
        )}
      </Fragment>
    );
  }
}
SearchContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  UI: state.UI,
  data: state.data,
});
export default connect(
  mapStateToProps,
  null
)(withStyle(styles)(SearchContainer));
