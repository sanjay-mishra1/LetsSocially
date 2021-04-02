import { Search } from "@material-ui/icons";
import React, { Component } from "react";
import withStyle from "@material-ui/core/styles/withStyles";
import { fade, InputBase } from "@material-ui/core";
//Redux
import store from "../../redux/store";
import { SEARCH_ACTIVE, SEARCH_INACTIVE } from "../../redux/type";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSearchResult } from "../../redux/actions/dataAction";
const styles = (theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "216px",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "-webkit-fill-available",
  },
  inputInput: {
    width: "-webkit-fill-available",
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
});
class SearchBar extends Component {
  state = {
    open: false,
    timer: 0,
    filter: {
      filter: this.props.filter
        ? this.props.filter
        : ["users", "users-username"],
    },
  };
  handleChange = (event) => {
    this.handleToggle();
    clearTimeout(this.state.timer);
    this.setState({
      timer: setTimeout(() => {
        this.props.getSearchResult(event.target.value, this.state.filter);
      }, 1000),
    }); // Will do the ajax stuff after 1000 ms, or 1 s

    //
  };
  handleToggle = () => {
    this.setState({
      open: true,
    });
  };
  onFocus = () => {
    if (!window.location.href.includes("/search/")) {
      store.dispatch({ type: SEARCH_ACTIVE });
      console.log("Focused");
      store.dispatch({ type: SEARCH_ACTIVE });
    }
  };
  onBlur = () => {
    if (!window.location.href.includes("/search/")) {
      setTimeout(function () {
        //Start the timer
        store.dispatch({ type: SEARCH_INACTIVE });
      }, 210);
    }
  };
  handleClose = (event) => {
    this.setState({
      open: false,
    });
  };

  handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      this.setState({
        open: false,
      });
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Search submit");
    this.props.getSearchResult(
      document.getElementById("search").value,
      this.state.filter
    );
  };
  componentDidMount() {
    if (this.props.defaultValue) {
      this.props.getSearchResult(this.props.defaultValue, this.state.filter);
    }
  }
  render() {
    const { classes, searchIconColor, customStyle, from } = this.props;
    console.log("from", from);
    if (window.location.href.includes("/search/") && from !== "nav")
      store.dispatch({ type: SEARCH_ACTIVE });
    return (
      <div className={classes.search} style={customStyle}>
        <form noValidate onSubmit={this.handleSubmit}>
          <div className={classes.searchIcon}>
            <Search color={searchIconColor} />
          </div>

          <InputBase
            placeholder="Search…"
            type="search"
            name="search"
            autoComplete="off"
            id="search"
            value={this.props.defaultValue}
            spellCheck="false"
            onChange={this.handleChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </form>
      </div>
    );
  }
}
SearchBar.propTypes = {
  getSearchResult: PropTypes.func.isRequired,
};
export default connect(null, { getSearchResult })(withStyle(styles)(SearchBar));
