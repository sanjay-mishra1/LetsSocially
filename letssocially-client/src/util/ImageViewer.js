import { Paper } from "@material-ui/core";
import { PlayCircleOutline } from "@material-ui/icons";
import React, { Fragment, useState } from "react";
import Carousel from "react-material-ui-carousel";

export default function ImageViewer(props) {
  return (
    <Carousel
      autoPlay={false}
      style={{ height: "-webkit-fill-available", display: "flex" }}
      indicators={false}
      animation="slide"
      navButtonsAlwaysVisible={props.images.length === 1 ? false : true}
      navButtonsAlwaysInvisible={props.images.length === 1 ? true : false}
    >
      {props.images.map((item, i) => (
        <Item
          key={i}
          imageContent={props.imageContent}
          playIconClassName={props.playIconClassName}
          index={i}
          item={item}
          className={props.className}
        />
      ))}
    </Carousel>
  );
}
function Item(props) {
  const [play, setPlay] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const onPlayClick = () => {
    let video = document.getElementById(`${props.index}`);

    if (play) {
      video.pause();
      setShowIcon(true);
    } else {
      setShowIcon(false);
      video.play();
    }
    setPlay(!play);
  };

  const videoEnded = () => {
    setShowIcon(true);
    setPlay(!play);
  };
  const getPoster = () => {
    var poster = props.item.replace(
      props.item.substring(
        props.item.indexOf("/o/") + 3,
        props.item.indexOf("?")
      ),
      props.item.substring(
        props.item.indexOf("/o/") + 3,
        props.item.indexOf("?") - 4
      ) + "_preview.png"
    );
    return poster.replace("video", "preview");
  };
  return (
    <div className={props.imageContent}>
      {props.item.includes(".mp4") ? (
        <Fragment>
          {showIcon && (
            <div className={props.playIconClassName}>
              <PlayCircleOutline
                onClick={onPlayClick}
                fontSize="large"
                style={{ color: "#ffffffc4" }}
                htmlColor="black"
              />
            </div>
          )}
          <video
            className={props.className}
            id={`${props.index}`}
            onClick={onPlayClick}
            onEnded={videoEnded}
            poster={getPoster}
          >
            <source src={props.item} />
          </video>
        </Fragment>
      ) : (
        <img src={props.item} alt="" className={props.className} />
      )}
    </div>
  );
}
