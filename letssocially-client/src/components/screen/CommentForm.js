import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import store from "../../redux/store";
import {
  Button,
  CircularProgress,
  TextField,
  withStyles,
} from "@material-ui/core";
import { submitComment } from "../../redux/actions/dataAction";
const styles = (theme) => ({
  ...theme.spreadIt,
  formData: {
    width: "inherit",
  },
  formTable: {
    width: "100%",
  },
  formContent: {
    width: "100%",
  },
});
class CommentForm extends Component {
  state = {
    body: "",
    loading: false,
    errors: {},
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors)
      this.setState({
        errors: nextProps.UI.errors,
      });
    if (nextProps.UI.loading) {
      this.setState({ loading: true });
    } else this.setState({ loading: false });

    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({
        body: "",
      });
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.submitComment(this.props.screenId, {
      body: this.state.body,
    });
    this.setState({ loading: true });
  };
  render() {
    const { classes, authenticated } = this.props;
    const errors = this.state.errors;
    const buttonMarkup = !this.state.loading ? (
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Add
      </Button>
    ) : (
      <CircularProgress size={20} style={{ marginBottom: -11 }} thickness={2} />
    );
    const commentFormMarkup = authenticated ? (
      <div style={{ width: "100%" }}>
        <form onSubmit={this.handleSubmit}>
          <table style={{ width: "100%" }}>
            <td style={{ width: "inherit" }}>
              <TextField
                name="body"
                type="text"
                autoComplete="off"
                label="Write comment "
                error={errors.comment ? true : false}
                helperText={errors.comment}
                value={this.state.body}
                onChange={this.handleChange}
                fullWidth
                className={classes.textField}
              ></TextField>
            </td>
            <td>{buttonMarkup}</td>
          </table>
        </form>
        {/* <hr className={classes.visibleSeparator} /> */}
      </div>
    ) : null;

    return commentFormMarkup;
  }
}
CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  screenId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps, { submitComment })(
  withStyles(styles)(CommentForm)
);
