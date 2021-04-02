import React, { Component } from "react";
import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@material-ui/core";
import withStyle from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
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
  root: {
    display: "flex",
    justifyContent: "space-between",
  },
});
class SearchFilters extends Component {
  componentDidMount() {}
  render() {
    const {
      classes,
      params: { handle, username, email, hashtag, screen, followers },
      onChange,
    } = this.props;
    console.log("filters", this.props);
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Advance Search
          </Typography>
          <hr className={classes.horizontalDivider} />
          <FormGroup>
            <Typography variant="subtitle1" className={classes.title}>
              User
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={handle}
                  onChange={onChange}
                  color="primary"
                  name="handle"
                />
              }
              classes={classes}
              labelPlacement="start"
              label="User handle"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={username}
                  onChange={onChange}
                  color="primary"
                  name="username"
                />
              }
              classes={classes}
              labelPlacement="start"
              label="Username"
            />
            <FormControlLabel
              classes={classes}
              control={
                <Checkbox
                  checked={email}
                  onChange={onChange}
                  color="primary"
                  name="email"
                />
              }
              labelPlacement="start"
              label="Email"
            />
            <Typography variant="subtitle1" className={classes.title}>
              Screen
            </Typography>
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={screen}
                  onChange={onChange}
                  color="primary"
                  name="screen"
                />
              }
              classes={classes}
              labelPlacement="start"
              label="Screen"
            /> */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={hashtag}
                  color="primary"
                  onChange={onChange}
                  name="hashtag"
                />
              }
              classes={classes}
              labelPlacement="start"
              label="Hashtag"
            />
            <Typography variant="subtitle1" className={classes.title}>
              Account
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={followers}
                  onChange={onChange}
                  name="followers"
                />
              }
              classes={classes}
              labelPlacement="start"
              label="Followers"
            />
          </FormGroup>
        </CardContent>
      </Card>
    );
  }
}

export default withStyle(styles)(SearchFilters);
