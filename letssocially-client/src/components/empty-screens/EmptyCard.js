import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";

export default function EmptyCard(props) {
  return (
    <Card>
      <CardMedia
        height="200"
        width="200"
        style={{ objectFit: "contain" }}
        component="img"
        src={props.imageUrl}
        image={props.imageUrl}
      />
      <CardContent>
        <Typography variant="h5">{props.title}</Typography>
        <Typography variant="subtitle2" style={{ marginTop: 20 }}>
          {props.desc}
        </Typography>
      </CardContent>
    </Card>
  );
}
