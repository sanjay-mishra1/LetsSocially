import React from "react";
import noPost from "../../images/social-media.svg";
import EmptyCard from "./EmptyCard";
export default function NoScreen() {
  console.log("no screen activated");
  return (
    <EmptyCard
      title={"No screen found"}
      desc={"Does not have any screens for you."}
      imageUrl={noPost}
    />
  );
}
