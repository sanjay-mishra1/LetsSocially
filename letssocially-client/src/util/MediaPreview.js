import { Grid } from "@material-ui/core";
import React, { Fragment } from "react";
import MediaBox from "./MediaBox";

const MediaPreview = (props) => {
  const mediaMarkup =
    props.files &&
    props.files.map((item, index) => (
      <Fragment>
        {!item.type.includes("mp4") ? (
          <MediaBox
            data-index={index}
            index={index}
            onRemove={props.removeMedia}
            file={item}
            key={index}
          />
        ) : null}
      </Fragment>
    ));

  return (
    <Fragment>{props.files && <Grid container>{mediaMarkup}</Grid>}</Fragment>
  );
};
export default MediaPreview;
