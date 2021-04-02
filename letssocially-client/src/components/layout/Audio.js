import { Grid } from "@material-ui/core";
import React, { Fragment, Component } from "react";
import Delete from "../../images/delete.svg";

class Audio extends Component {
  componentDidMount() {}
  render() {
    console.log("audio is loaded ", this.props);
    return (
      <Grid container>
        <Grid item xs={11} style={{ marginTop: "1em" }}>
          <audio crossOrigin controls style={{ width: "100%" }}>
            <source src={this.props.uri} type="audio/mpeg" />
          </audio>
        </Grid>
        {this.props.type === "preview" && (
          <Fragment>
            <Grid>
              <img
                src={Delete}
                alt="delete"
                onClick={this.props.item.onRemove}
                href="#"
                index={this.props.item.index}
                className="deleteBt"
                style={{ marginTop: 13, marginLeft: 6 }}
              />
            </Grid>
            <p style={{ overflow: "auto", width: "auto", marginTop: "auto" }}>
              {this.props.item.file.name}
            </p>
          </Fragment>
        )}
        {this.props.type === "Audio" && (
          <p style={{ overflow: "auto", width: "auto", marginTop: "auto" }}>
            {this.props.name}
          </p>
        )}
      </Grid>
    );
  }
}

export default Audio;
