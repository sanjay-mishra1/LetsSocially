import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  ERROR,
  MESSAGE,
  HANDLE_FOLLOWING_LIST,
} from "../type";
import axios from "axios";
export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      localStorage.setItem("handle", "waiting");
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      let error;
      if (err.response.data.errors) error = err.response.data.errors;
      else error = err.response.data;
      console.log(error);
      dispatch({
        type: SET_ERRORS,
        payload: error,
      });
    });
};

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      localStorage.setItem("handle", "waiting");

      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      let error;
      if (err.response.data.errors) error = err.response.data.errors;
      else error = err.response.data;
      dispatch({
        type: SET_ERRORS,
        payload: error,
      });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  localStorage.removeItem("handle");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
  if (
    window.location.href.includes !== "login" ||
    window.location.href.includes !== "signup"
  )
    window.location.href = "/login";
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/user")
    .then((res) => {
      res.data = res.data.userData;
      console.log("Profile at getUserData", res.data);
      localStorage.setItem("handle", res.data.credentials.handle);
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      try {
        if (
          err.response.data.code &&
          err.response.data.code === "auth/id-token-expired"
        ) {
          if (localStorage.getItem("handle")) logoutUser();
          //dispatch({ type: SET_UNAUTHENTICATED });
        }
      } catch (e) {}
      console.log(err);
    });
};

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  console.log("image", formData);
  axios
    .post("/user/image", formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user", userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  axios
    .post("/notifications", notificationIds)
    .then((res) => {
      dispatch({
        type: MARK_NOTIFICATIONS_READ,
      });
    })
    .catch((err) => console.log(err));
};

export const followUser = (handle, isFollow) => (dispatch) => {
  console.log("sending follow request");
  console.log("handle", handle);

  axios
    .post(`/follow/${handle}`)
    .then((res) => {
      console.log("dispatching message action", res.data.message);
      dispatch({
        type: HANDLE_FOLLOWING_LIST,
        payload: {
          value: 1,
          userHandle: handle,
          isFollower: window.location.href.includes(localStorage.handle)
            ? !isFollow
            : isFollow,
        },
      });
      try {
        dispatch({ type: MESSAGE, payload: res.data.message });
      } catch (error) {
        console.log(error);
      }
    })
    .catch((err) => {
      let message;
      if (
        err.response.data.code &&
        err.response.data.code === "auth/id-token-expired"
      )
        message = "Login to follow the user";
      else message = err.respone.error;
      console.log("dispatching error action", message);
      dispatch({ type: ERROR, payload: message });
    });
};
export const unFollowUser = (handle) => (dispatch) => {
  console.log("handle", handle);
  axios
    .post(`/unfollow/${handle}`)
    .then((res) => {
      dispatch({ type: MESSAGE, payload: res.data.message });
      dispatch({
        type: HANDLE_FOLLOWING_LIST,
        isFollower: handle === localStorage.handle,
        payload: {
          value: -1,
          userHandle: handle,
          isFollower: handle === localStorage.handle,
        },
      });
      console.log("dispatching message action", res.data.message);
    })
    .catch((err) => {
      console.log(err);
      let message;
      if (
        err.response.data.code &&
        err.response.data.code === "auth/id-token-expired"
      )
        message = "Login to unfollow the user";
      else message = err.respone.error;
      console.log("dispatching error action", message);

      dispatch({ type: ERROR, payload: message });
    });
};
const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
