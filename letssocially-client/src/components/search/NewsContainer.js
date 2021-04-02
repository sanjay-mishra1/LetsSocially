import { Card, CardContent, Typography } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { getNews } from "../../redux/actions/dataAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NewsBox from "./NewsBox";
const style = {
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
};
class NewsContainer extends Component {
  componentDidMount() {
    this.props.getNews("all");
  }
  render() {
    const { news } = this.props.data;
    const { classes } = this.props;
    const newsMarkup = news
      ? news.map((item, index) => (
          <Fragment>
            <NewsBox width={this.props.width} key={index} news={item} />{" "}
            <hr className={classes.horizontalDivider} />
          </Fragment>
        ))
      : null;
    return (
      <Fragment>
        {news && (
          <Card>
            <CardContent>
              <Typography variant="h6" className={classes.title}>
                What’s happening
              </Typography>
              <hr className={classes.horizontalDivider} />
              {newsMarkup}
            </CardContent>
          </Card>
        )}
      </Fragment>
    );
  }
}
NewsContainer.propTypes = {
  news: PropTypes.array.isRequired,
  getNews: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  data: state.data,
});
export default connect(mapStateToProps, { getNews })(
  withStyles(style)(NewsContainer)
);
