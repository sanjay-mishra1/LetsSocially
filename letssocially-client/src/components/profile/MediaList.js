import { Card, CardContent, CardMedia, Grid } from "@material-ui/core";
import { ImageOutlined, ImageSearch, Movie } from "@material-ui/icons";
import PlayCircleOutlineTwoToneIcon from "@material-ui/icons/PlayCircleOutlineTwoTone";
import React from "react";
import { Fragment } from "react";
import EmptyCard from "../empty-screens/EmptyCard";
import noImage from "../../images/no-image.svg";

const MediaList = (props) => {
  console.log("media-list", props.media);
  const mediaMarkup =
    props.media && props.media.length === 0 ? (
      <EmptyCard
        title={`No ${props.type} found.`}
        imageUrl={props.type.includes("image") ? noImage : Movie}
      />
    ) : (
      props.media.map((item, index) => (
        <Fragment>
          <Card key={index} style={{ margin: 10, width: 120, height: 120 }}>
            <CardMedia
              image={
                item.imageUrl.includes(".mp4")
                  ? item.imageUrl
                      .replace(
                        item.imageUrl.substring(
                          item.imageUrl.indexOf("/o/") + 3,
                          item.imageUrl.indexOf("?")
                        ),
                        item.imageUrl.substring(
                          item.imageUrl.indexOf("/o/") + 3,
                          item.imageUrl.indexOf("?") - 4
                        ) + "_preview.png"
                      )
                      .replace("video", "preview")
                  : item.imageUrl
              }
              alt="Contemplative Reptile"
              style={{ height: 200, width: 200 }}
              component="div"
            >
              {item.imageUrl.includes("mp4") && (
                <PlayCircleOutlineTwoToneIcon
                  fontSize="large"
                  style={{
                    marginTop: "78px",
                    marginLeft: "84px",
                    color: "#ffffffc4",
                  }}
                />
              )}
            </CardMedia>
          </Card>
        </Fragment>
      ))
    );
  return <div container> {mediaMarkup}</div>;
};
export default MediaList;
