import { Grid, Typography } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import withStyle from "@material-ui/core/styles/withStyles";
const styles = (theme) => ({
  ...theme.spreadIt,
  image: {
    width: 100,
    borderRadius: "10%",
  },
  item: {
    marginTop: 10,
    marginBottom: 10,
  },
  horizontalDivider: {
    borderColor: "#eff1f3",
    marginLeft: -17,
    marginRight: -17,
    width: "183%",
    marginTop: -1,
    borderTop: "0px solid #eff1f3",
  },
});
class NewsBox extends Component {
  handleClick = () => {
    const url = this.props.news.url;
    if (this === "self") window.location.href = `/${url}`;
    else window.open(url, "_blank");
  };
  render() {
    const {
      classes,
      news: { title, imageUrl, type },
    } = this.props;
    const newsMarkup =
      type !== "self" ? (
        <Fragment>
          <Grid item xs={3} sm={3}>
            <img className={classes.image} src={imageUrl} alt={title} />
          </Grid>
        </Fragment>
      ) : null;
    return (
      <Grid
        onClick={this.handleClick}
        alignItems="center"
        className={classes.link}
        container
      >
        {this.props.width === "xs" && newsMarkup}
        <Grid item xs={9} sm={8} className={classes.item}>
          <Typography
            style={{
              paddingLeft: this.props.width === "xs" ? 13 : 5,
              paddingRight: 5,
            }}
            variant="body2"
          >
            {title}
          </Typography>
        </Grid>
        {this.props.width !== "xs" && newsMarkup}
      </Grid>
    );
  }
}

export default withStyle(styles)(NewsBox);
