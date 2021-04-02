import {
  Card,
  CardContent,
  Divider,
  GridList,
  GridListTile,
  GridListTileBar,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { getFollowSuggestions } from "../../redux/actions/dataAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SmallProfile from "./SmallProfile";
const style = (theme) => ({
  horizontalDivider: {
    borderColor: "#eff1f3",
    marginLeft: -17,
    marginRight: -17,
    marginTop: -1,
    borderTop: "0px solid #eff1f3",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  gridList: {
    flexWrap: "nowrap",
    overflowY: "visible",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  root: {
    // display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  scroll: {
    marginLeft: -16,
    marginRight: -16,
    paddingLeft: 9,
    paddingRight: 10,
    overflow: "auto",
    whiteSpace: "nowrap",
  },
});
class FollowSuggestions extends Component {
  componentDidMount() {
    this.props.getFollowSuggestions();
  }
  render() {
    const { suggestions } = this.props.data;
    const { classes, width } = this.props;
    const suggestionsMarkup = suggestions
      ? suggestions.map((item, index) => (
          <Fragment>
            <SmallProfile key={index} user={item} showBt />
          </Fragment>
        ))
      : null;

    return (
      <div id={this.props.id}>
        {suggestions && !this.props.hide && (
          <Card className={classes.root}>
            <CardContent>
              <Typography variant="h6" className={classes.title}>
                Who to follow
              </Typography>
              <hr className={classes.horizontalDivider} />
              {width === "xs" ? (
                <div className={classes.scroll}>
                  <GridList
                    spacing={5}
                    style={{
                      marginBottom: 17,
                    }}
                    className={classes.gridList}
                    cols={2}
                  >
                    {suggestions &&
                      !this.props.hide &&
                      suggestions.map((item, index) => (
                        <div key={index}>
                          <GridListTile style={{ width: 130 }}>
                            <Paper variant="outlined">
                              <SmallProfile vertical user={item} showBt />
                            </Paper>
                          </GridListTile>
                        </div>
                      ))}
                  </GridList>
                </div>
              ) : (
                suggestionsMarkup
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
}
FollowSuggestions.propTypes = {
  suggestions: PropTypes.array.isRequired,
  getFollowSuggestions: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  data: state.data,
});
export default connect(mapStateToProps, { getFollowSuggestions })(
  withStyles(style)(FollowSuggestions)
);
