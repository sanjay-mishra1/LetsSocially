import { Button } from "@material-ui/core";
import React from "react";
import store from "../../redux/store";
import { followUser, unFollowUser } from "../../redux/actions/userAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";
const FollowButton = (props) => {
  const getBtText = () => {
    if (
      props.user.following_list &&
      props.user.following_list.includes(props.userHandle)
    )
      return "UnFollow";
    else if (
      props.user.followers_list &&
      props.user.followers_list.includes(props.userHandle)
    )
      return "Follow";
    else return props.defaultText ? props.defaultText : "Follow";
  };
  const [btText, setBtText] = React.useState(getBtText());
  const handleFollowClick = (event) => {
    event.cancelBubble = true;
    if (event.stopPropagation) event.stopPropagation();

    if (btText === "Follow") {
      setBtText("Following");
      store.dispatch(followUser(props.userHandle, true));
    } else {
      setBtText("Follow");
      store.dispatch(unFollowUser(props.userHandle, false));
    }
  };
  return (
    <React.Fragment>
      <Button onClick={handleFollowClick} color="primary" variant="outlined">
        {btText}
      </Button>
    </React.Fragment>
  );
};
FollowButton.propTypes = {
  user: PropTypes.array,
};
const mapStateToProps = (state) => ({
  user: state.user.credentials,
});
export default connect(mapStateToProps, null)(FollowButton);
