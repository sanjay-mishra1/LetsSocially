import { Grid, Typography } from "@material-ui/core";
import { Chat } from "@material-ui/icons";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import LikeButton from "../components/screen/LikeButton";
import MyButton from "./MyButton";

export default function UserBadge(props) {
  const getLike = () => {
    if (!props.newLike) return props.screen.likeCount;
    else return props.newLike;
  };
  const getComment = () => {
    if (!props.newComment) return props.screen.commentCount;
    else return props.newComment;
  };
  return (
    <Grid container>
      <Grid item xs={"auto"}>
        <img
          src={props.screen.userImage}
          alt="Profile"
          style={{ borderRadius: 64, width: 75, height: 64, margin: 10 }}
        />
      </Grid>
      <Grid item xs={9}>
        <Typography
          component={Link}
          color="primary"
          variant="h5"
          to={`/user/${props.screen.userHandle}`}
        >
          @{props.screen.userHandle}
        </Typography>
        {/* <hr className={props.screen.invisibleSeparator} /> */}
        <Typography variant="body2" color="textSecondary">
          {dayjs(props.screen.createdAt).format("h:mm a, MMMM DD YYYY")}
        </Typography>
        {/* <hr className={props.screen.invisibleSeparator} /> */}
        <br />
        <Typography variant="body1">{props.screen.body}</Typography>
        <LikeButton
          screenId={props.screen.screenId}
          key={props.screen.screenId}
        />
        <span>{getLike()} Likes</span>
        <MyButton tip="comment">
          <Chat color="primary" />
        </MyButton>
        <span>{getComment()} comments</span>
      </Grid>
    </Grid>
  );
}
