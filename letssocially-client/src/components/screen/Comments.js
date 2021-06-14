import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Grid, Typography, withStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const styles = (theme) => ({
  ...theme.spreadIt,
  commentImage: {
    height: 30,
    width: 30,
    objectFit: "cover",
    borderRadius: "50%",
  },
  commentData: {
    // marginLeft: 20,
  },
});
class Comments extends Component {
  render() {
    const { comments, classes } = this.props;

    return (
      <Grid container>
        {comments !== undefined &&
          comments.map((comment, index) => {
            const { body, createdAt, userImage, userHandle } = comment;
            return (
              <Fragment key={createdAt}>
                <div style={{ display: "flex" }}>
                  <div item sm={3}>
                    <img
                      src={userImage}
                      alt="comment"
                      className={classes.commentImage}
                    />
                  </div>
                  <div style={{ marginLeft: 10, marginTop: -6 }} item sm={9}>
                    <div className={classes.commentData}>
                      <Typography
                        variant="body1"
                        component={Link}
                        to={`/users/${userHandle}`}
                        style={{ fontWeight: "bold" }}
                        color="primary"
                      >
                        {userHandle}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                      </Typography>
                      <Typography variant="body1">{body}</Typography>
                    </div>
                  </div>
                </div>
                {index !== comments.length - 1 && (
                  <hr className={classes.visibleSeparator} />
                )}
              </Fragment>
            );
          })}
      </Grid>
    );
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
};

export default withStyles(styles)(Comments);
