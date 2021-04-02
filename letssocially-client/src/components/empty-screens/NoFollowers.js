import React, { Fragment } from "react";
import EmptyCard from "./EmptyCard";
import noFollower from "../../images/follower.svg";
import FollowSuggestions from "../profile/FollowSuggestions";
export default function NoFollowers() {
  return (
    <Fragment>
      <EmptyCard
        title={"No followers"}
        desc={
          "You are not following any one. Follow people to see their screens here"
        }
        imageUrl={noFollower}
      />
      <FollowSuggestions noId />
    </Fragment>
  );
}
