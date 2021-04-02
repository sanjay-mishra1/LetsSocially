import React, { Fragment } from "react";
import NoImg from "../images/no-image.png";

//Mui
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import withStyles from "@material-ui/core/styles/withStyles";
import { Grid } from "@material-ui/core";

const styles = (theme) => ({
  ...theme.spreadIt,
  card: {
    display: "flex",
    margin: 10,
  },
  cardContent: {
    width: "100%",
    flexDirction: "col",
    padding: 25,
  },
  cover: {
    minWidth: 200,
    objectFit: "cover",
  },
  handle: {
    width: 60,
    height: 18,
    marginBottom: 10,

    backgroundColor: theme.palette.primary.main,
  },
  date: {
    height: 14,
    width: 100,
    backgroundColor: "rgba(0,0,0,0.3)",
    marginBottom: 10,
  },
  fullLine: {
    height: 15,
    width: "90%",
    marginBottom: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  halfLine: {
    height: 15,
    width: "50%",
    backgroundColor: "rgba(0,0,0,0.6)",

    marginBottom: 10,
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});

const MediaSkeleton = (props) => {
  const { classes } = props;
  const content = Array.from({ length: 5 }).map((item, index) => (
    <Grid item>
      <Card className={classes.card} key={index}>
        <CardContent className={classes.box}></CardContent>
      </Card>
    </Grid>
  ));
  return <Grid container>{content}</Grid>;
};

export default withStyles(styles)(MediaSkeleton);
