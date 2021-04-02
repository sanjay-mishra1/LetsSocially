import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Screen from "../components/screen/Screen";
import Profile from "../components/profile/Profile";
import { connect } from "react-redux";
import { getScreens } from "../redux/actions/dataAction";
import PropTypes from "prop-types";
import ScreenSkeleton from "../util/ScreenSkeleton";
import NewsContainer from "../components/search/NewsContainer";
import FollowSuggestions from "../components/profile/FollowSuggestions";
import NoScreen from "../components/empty-screens/NoScreen";
import NoFollowers from "../components/empty-screens/NoFollowers";
import { withStyles, withWidth } from "@material-ui/core";
const style = {
  root: { width: "100%" },
};
export class home extends Component {
  componentDidMount() {
    if (localStorage.getItem("handle")) this.props.getScreens();
    else window.location.href = "/login";
  }
  setNoFollow = () => {
    const extra = document.getElementById("follow-suggestions");
    if (extra) extra.style = "display:none";
    return <NoFollowers />;
  };
  render() {
    const { screens, loading } = this.props.data;
    const { classes, width } = this.props;
    let recentScreensMarkup = !loading ? (
      screens.length > 0 ? (
        screens.map((screen) => (
          <Screen key={screen.screenId} screen={screen} />
        ))
      ) : (
        <NoScreen />
      )
    ) : (
      <ScreenSkeleton />
    );
    console.log(this.props);
    return (
      <div>
        <Grid
          container
          spacing={width === "xs" ? 0 : 2}
          justify={width === "xs" ? "center" : null}
          className={classes.root}
        >
          <Grid item sm={3} lg={3} xs={12}>
            <FollowSuggestions
              width={this.props.width}
              id={"follow-suggestions"}
            />
          </Grid>
          <Grid item sm={5} lg={5} xs={12}>
            {(screens && screens.length > 0) || loading
              ? recentScreensMarkup
              : !loading && this.setNoFollow()}
          </Grid>
          <Grid item lg={3} sm={4} xs={12}>
            <NewsContainer width={width} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

home.propTypes = {
  getScreens: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  data: state.data,
});

export default withWidth()(
  connect(mapStateToProps, { getScreens })(withStyles(style)(home))
);
