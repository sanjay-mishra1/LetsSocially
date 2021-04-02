import React from "react";
import EmptyCard from "../components/empty-screens/EmptyCard";
import noImage from "../images/no-image.svg";
import noVideo from "../images/no-video.svg";
import noAudio from "../images/no-audio.svg";

import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from "@material-ui/core";
import { Close, PlayCircleFilledOutlined } from "@material-ui/icons";
import MyButton from "./MyButton";
import { Fragment } from "react";
import Audio from "../components/layout/Audio";
import dayjs from "dayjs";
import SmallProfile from "../components/profile/SmallProfile";

const ImageGrid = (props) => {
  const [openDialog, setopenDialog] = React.useState(false);
  const [item, setItem] = React.useState(null);
  const onDialogClose = () => {
    setopenDialog(false);
    setItem(null);
  };
  const handleOpenDialog = (item) => {
    console.log("Opening dialog");
    setItem(item);
    setopenDialog(true);
  };
  const getType = () => {
    if (props.index === 4) return "image";
    else if (props.index === 5) return "video";
    else return "audio";
  };
  const getImage = () => {
    if (props.index === 4) return noImage;
    else if (props.index === 5) return noVideo;
    else return noAudio;
  };
  const mediaMarkup =
    props.media && props.media.length === 0 ? (
      <EmptyCard title={`No ${getType()} found.`} imageUrl={getImage()} />
    ) : (
      props.media &&
      props.media.map((item, index) => (
        <Fragment>
          {props.index === 6 ? (
            <Grid sm={12} xs={12} item key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Audio
                    uri={item.imageUrl}
                    type="Audio"
                    name={
                      <Fragment>
                        <Typography variant="body1">
                          From {item.uploadFrom}
                        </Typography>
                        <Typography variant="caption">
                          Uploaded on{" "}
                          {dayjs(item.uploadDate).format("DD MMM YYYY")}
                        </Typography>
                      </Fragment>
                    }
                  />
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <div
              className="img-wrap"
              key={index}
              layout
              onClick={() => handleOpenDialog(item)}
              whileHover={{ opacity: 1 }}
            >
              <img
                src={
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
                alt="upload img"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              />
            </div>
          )}
        </Fragment>
      ))
    );
  const getPoster = () => {
    var poster = item.imageUrl.replace(
      item.imageUrl.substring(
        item.imageUrl.indexOf("/o/") + 3,
        item.imageUrl.indexOf("?")
      ),
      item.imageUrl.substring(
        item.imageUrl.indexOf("/o/") + 3,
        item.imageUrl.indexOf("?") - 4
      ) + "_preview.png"
    );
    return poster.replace("video", "preview");
  };
  const [play, setPlay] = React.useState(false);
  const [showIcon, setShowIcon] = React.useState(true);
  const onPlayClick = () => {
    let video = document.getElementById("video");
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
  console.log(props);
  return (
    <Fragment>
      {!props.media || props.media.length === 0 ? (
        <div>{mediaMarkup}</div>
      ) : props.index === 3 ? (
        <Grid container sm={12}>
          {mediaMarkup}
        </Grid>
      ) : (
        <div className={props.index === 6 ? null : "img-grid"}>
          {mediaMarkup}
          {openDialog && (
            <Dialog
              fullScreen={props.width === "xs"}
              open={openDialog}
              fullWidth
              onClose={onDialogClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogContent>
                <MyButton
                  inlineCss={{ position: "absolute", left: "90%" }}
                  onClick={onDialogClose}
                  tip="Close"
                >
                  <Close
                    htmlColor="black"
                    style={{
                      backgroundColor: "#4f4f4f99",
                      padding: 2,
                      borderRadius: 50,
                    }}
                  />
                </MyButton>
                <SmallProfile user={props.user} />

                <div className={props.imageContent}>
                  {item.imageUrl.includes(".mp4") ? (
                    <Fragment>
                      {showIcon && (
                        <div className={props.playIconClassName}>
                          <PlayCircleFilledOutlined
                            onClick={onPlayClick}
                            fontSize="large"
                            htmlColor="#369fff"
                          />
                        </div>
                      )}
                      <video
                        className={props.className}
                        id={"video"}
                        width="100%"
                        height="100%"
                        style={
                          props.width !== "xs"
                            ? {
                                height: "-webkit-fill-available",
                                padding: 25,
                              }
                            : null
                        }
                        onClick={onPlayClick}
                        onEnded={videoEnded}
                        poster={getPoster()}
                      >
                        <source src={item.imageUrl} />
                      </video>
                    </Fragment>
                  ) : (
                    <img
                      src={item.imageUrl}
                      alt=""
                      width="100%"
                      className={props.className}
                    />
                  )}
                </div>
                <Typography variant="body1">From {item.uploadFrom}</Typography>
                <Typography variant="caption">
                  Uploaded on {dayjs(item.uploadDate).format("DD MMM YYYY")}
                </Typography>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </Fragment>
  );
};
export default ImageGrid;
