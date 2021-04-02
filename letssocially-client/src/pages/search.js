import {
  Card,
  CardContent,
  FormControlLabel,
  FormGroup,
  Grid,
  withStyles,
} from "@material-ui/core";
import React, { Component, Fragment } from "react";
import SearchBar from "../components/search/SearchBar";
import FollowSuggestions from "../components/profile/FollowSuggestions";

import PropTypes from "prop-types";
import SearchFilters from "../components/search/SearchFilters";
import NewsContainer from "../components/search/NewsContainer";
import SearchContainer from "../components/search/SearchContainer";
import withWidth from "@material-ui/core/withWidth";
import { getSearchResult } from "../redux/actions/dataAction";

const styles = (theme) => ({
  checkBoxStyle: {
    marginTop: 10,
    marginRight: 0,
    ".MuiTypography-body1": {
      marginRight: "auto",
    },
    label: {
      marginRight: "auto",
    },
  },
  horizontalDivider: {
    borderColor: "#eff1f3",
    marginLeft: -17,
    marginRight: -17,
    marginTop: "10px",
    borderTop: "0px solid #eff1f3",
  },
  title: {
    fontWeight: "bold",
  },
  root: { width: "-webkit-fill-available" },
  gridRoot: { width: "100%" },
});
class search extends Component {
  state = {
    handle: true,
    username: true,
    email: false,
    // screen: false,
    hashtag: false,
    followers: false,
    filter: [], //["users", "users-username"],
    filterMap: {
      handle: "users",
      username: "users-username",
      email: "users-email",
      // screen: "screens",
      hashtag: "screens-hashtag",
      followers: "users-followers",
    },
  };
  handleChange = (event) => {
    console.log("checkbox clicked");
    this.setState({
      [event.target.name]: event.target.checked,
    });

    this.handleFilterChange(event.target.name, event.target.checked);
  };
  handleFilterChange = (name, isChecked) => {
    if (isChecked) {
      if (!this.state.filter.includes(name))
        this.state.filter.push(this.state.filterMap[name]);
    } else {
      let index = this.state.filter.indexOf(this.state.filterMap[name]);
      this.state.filter.splice(index, 1);
    }
    this.setState({ filter: this.state.filter });
  };
  componentDidMount() {
    var type = new URLSearchParams(window.location.search).get("type");
    if (type !== null) {
      this.setState({
        username: false,
        handle: false,
        [type]: true,
        filter: [],
      });

      this.handleFilterChange(type, true);
    } else {
      let filter = { filter: ["users", "users-username"] };
      this.setState(filter);
      this.setState({ filter: filter });
    }
  }
  render() {
    const { classes, width } = this.props;
    const searchContainerStyle = {
      width: "auto",
      position: "inherit",
      marginTop: 14,
      // marginLeft: 23,
      // marginRight: 17,
    };
    const searchBoxContainer = {
      borderColor: "#369fff",
      borderWidth: 1,
      width: "auto",
      marginRight: 0,
      marginLeft: 0,
      borderStyle: "solid",
      backgroundColor: "#ffffff",
    };
    return (
      <Fragment>
        <Grid
          container
          spacing={width === "xs" ? 0 : 5}
          justify="center"
          className={classes.gridRoot}
        >
          {this.props.width !== "xs" && (
            <Grid item sm={3} lg={3} xs={12} style={{ width: "60em" }}>
              <SearchFilters onChange={this.handleChange} params={this.state} />
            </Grid>
          )}
          <Grid
            className={classes.root}
            item
            sm={6}
            lg={6}
            xs={12}
            style={this.items}
          >
            <SearchBar
              from="page"
              defaultValue={new URLSearchParams(window.location.search).get(
                "key"
              )}
              filter={this.state.filter}
              customStyle={searchBoxContainer}
              searchIconColor="primary"
            ></SearchBar>

            <SearchContainer from="page" customStyle={searchContainerStyle} />
          </Grid>
          <Grid item sm={3} lg={3} xs={12} style={this.items}>
            {this.props.width === "xs" && (
              <SearchFilters onChange={this.handleChange} params={this.state} />
            )}
            <NewsContainer width={this.props} />
            <FollowSuggestions />
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}
search.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withWidth()(withStyles(styles)(search));
