import { Search } from "@material-ui/icons";
import React from "react";
import withStyle from "@material-ui/core/styles/withStyles";
import {
  CircularProgress,
  fade,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
//Redux
import store from "../../redux/store";
import { SEARCH_ACTIVE, SEARCH_DATA, SEARCH_INACTIVE } from "../../redux/type";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getSearchResult } from "../../redux/actions/dataAction";
import { Link, useHistory } from "react-router-dom";

const styles = (theme) => ({
  search: {
    position: "relative",
    maxWidth: 300,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: "auto",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },
  searchContainer: {
    position: "absolute",
    width: "100%",
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
function SearchBar(props) {
  let history = useHistory();
  const [timer, setTimer] = React.useState(0);
  const [query, setQuery] = React.useState(
    props.defaultValue ? props.defaultValue : ""
  );

  let filter = props.filter ? props.filter : ["users", "users-username"];
  React.useEffect(() => {
    if (props.defaultValue) {
      props.getSearchResult(props.defaultValue, filter);
    }
    if (window.location.href.includes("/search/") && props.from !== "nav")
      store.dispatch({ type: SEARCH_ACTIVE });
  }, []);
  const handleChange = (event) => {
    if (!window.location.pathname.includes("/search") || props.from !== "nav") {
      clearTimeout(timer);
      if (props.from === "nav")
        store.dispatch({
          type: SEARCH_DATA,
          payload: null,
        });
      setQuery(event.target.value);
      setTimer(
        setTimeout(() => {
          props.getSearchResult(event.target.value, filter);
        }, 1000)
      );
    }
  };

  const onFocus = () => {
    store.dispatch({ type: SEARCH_ACTIVE });
  };
  const onBlur = () => {
    if (props.from === "nav") {
      setTimeout(function () {
        //Start the timer
        store.dispatch({ type: SEARCH_INACTIVE });
        store.dispatch({
          type: SEARCH_DATA,
          payload: null,
        });
        setQuery("");
      }, 210);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.getSearchResult(document.getElementById("search").value, filter);
  };
  const handleClick = (userHandle) => {
    history.push(`/user/${userHandle}`);
  };

  const { classes, searchIconColor, customStyle } = props;
  if (window.location.pathname.includes("/search") && props.from !== "nav")
    store.dispatch({ type: SEARCH_ACTIVE });
  return (
    <div className={classes.search} style={customStyle}>
      <form noValidate onSubmit={handleSubmit}>
        <div className={classes.searchIcon}>
          <Search color={searchIconColor} />
        </div>

        <InputBase
          placeholder="Search…"
          type="search"
          name="search"
          autoComplete="off"
          id="search"
          value={query}
          spellCheck="false"
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
        />
      </form>
      {props.data && query && query.trim() !== "" && props.from === "nav" && (
        <Paper className={classes.searchContainer}>
          <List component="nav" aria-label="main mailbox folders">
            {props.data.searchResult ? (
              props.data.searchResult.length === 0 ? (
                <p style={{ paddingLeft: 15 }}>No result found</p>
              ) : (
                <React.Fragment>
                  {props.data.searchResult.map((item, index) => (
                    <ListItem
                      button
                      key={index}
                      onClick={() => handleClick(item.userHandle)}
                    >
                      <ListItemIcon>
                        <img
                          style={{ width: 40 }}
                          src={item.userImage}
                          alt={item.username}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.username}
                        secondary={`@${item.userHandle}`}
                      />
                    </ListItem>
                  ))}{" "}
                  <ListItem
                    button
                    component={Link}
                    to={`/search/?type=handle&key=${query}`}
                  >
                    <ListItemText primary={"See more"} />
                  </ListItem>
                </React.Fragment>
              )
            ) : (
              <CircularProgress
                color="primary"
                size={30}
                style={{
                  marginLeft: "40%",
                  color: "#369fff",
                }}
              />
            )}
          </List>
        </Paper>
      )}
    </div>
  );
}
SearchBar.propTypes = {
  getSearchResult: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  data: state.data,
});
export default connect(mapStateToProps, { getSearchResult })(
  withStyle(styles)(SearchBar)
);
