import { CardMedia, Grid } from "@material-ui/core";
import React, { Fragment } from "react";
import Delete from "../images/delete.svg";
import Audio from "../components/layout/Audio";
import { DeleteOutline } from "@material-ui/icons";
const MediaBox = (props) => {
  return (
    <Fragment>
      {props.file.type.includes("audio/mpeg") ? (
        <Grid item xs={12} className="mediaBox">
          <Audio item={props} uri={props.file.uri} type="preview"></Audio>
        </Grid>
      ) : (
        <Grid item xs className="mediaBox">
          {/* <img
            src={Delete}
            alt="delete"
            onClick={props.onRemove}
            href="#"
            index={`${props.index}${
              props.file.finalName.includes("_preview") ? "-preview" : ""
            }`}
            className="deleteBt"
          /> */}

          {/* <img
            src={props.file.uri}
            alt="item"
            width={100}
            height={100}
            style={{ objectFit: "cover" }}
          /> */}
          <CardMedia
            image={props.file.uri}
            title="item"
            style={{ width: 100, height: 100 }}
          >
            {/* <DeleteOutline color="error" /> */}
            <img
              src={Delete}
              alt="delete"
              onClick={props.onRemove}
              href="#"
              index={`${props.index}${
                props.file.finalName.includes("_preview") ? "-preview" : ""
              }`}
              // className="deleteBt"
            />
          </CardMedia>
          <p>{props.file.name}</p>
        </Grid>
      )}
    </Fragment>
  );
};
export default MediaBox;
