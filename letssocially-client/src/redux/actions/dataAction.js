import {
  SET_SCREENS,
  LOADING_DATA,
  LIKE_SCREEN,
  UNLIKE_SCREEN,
  SET_ERRORS,
  DELETE_SCREEN,
  POST_SCREEN,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  SET_SCREEN,
  SUBMIT_COMMENT,
  SEARCH_DATA,
  NEWS_DATA,
  FOLLOW_LIST,
  FOLLOW_SUGGESTIONS,
  SET_MEDIA,
  ADD_POLL_RESPONSE,
  ADD_USER_POLL_RESPONSE,
  SET_DATA,
  MESSAGE,
  ERROR,
} from "../type";
import axios from "axios";
var FormData = require("form-data");
var fs = require("fs");
//get old screens

export const getScreens = () => (dispatch) => {
  dispatch({
    type: LOADING_DATA,
  });
  axios
    .get("/screens")
    .then((res) => {
      dispatch({
        type: SET_SCREENS,
        payload: res.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: SET_SCREENS,
        payload: [],
      });
    });
};

//post a screen
export const postScreen = (newScreen) => (dispatch) => {
  dispatch({
    type: LOADING_UI,
  });
  console.log(newScreen);
  if (newScreen.polls && newScreen.polls.length > 0 && newScreen.body === "") {
    dispatch({
      type: SET_ERRORS,
      payload: { body: "Must not be empty" },
    });
    return;
  }

  try {
    axios
      .post("/screens", newScreen)
      .then((res) => {
        console.log("Screen uploaded", res.data);
        dispatch({
          type: POST_SCREEN,
          payload: res.data.resScreen,
        });
        dispatch({
          type: CLEAR_ERRORS,
        });
      })
      .catch((err) => {
        console.log("Error received", err);
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,
        });
      });
  } catch (err) {}
};
const getFormatedScreen = (screen) => {
  var data = new FormData();
  data.append("body", screen.body);
  if (screen.polls) {
    data.append("polls", JSON.stringify(screen.polls));
    data.append("pollsAttributes", JSON.stringify(screen.pollsAttributes));
  }
  if (screen.files && screen.files.length > 0)
    screen.files.map((file, index) => {
      console.log("items", file);
      if (screen.filename[index].includes("_preview"))
        return data.append(
          screen.filename[index],
          urltoFile(file, `${screen.filename[index]}.png`, "image/png")
        );
      else return data.append(screen.filename[index], file);
    });
  return data;
  // data.append('1212s1212_test', fs.createReadStream('/C:/Users/Sanja/Desktop/th (1).jpg'));
  // data.append('1212s1213_test', fs.createReadStream('/C:/Users/Sanja/Desktop/RB922.jpg'));
};
//post screen new method
//post a screen
export const addScreen = (newScreen) => (dispatch) => {
  dispatch({
    type: LOADING_UI,
  });
  console.log(newScreen);
  if (newScreen.polls && newScreen.polls.length > 0 && newScreen.body === "") {
    dispatch({
      type: SET_ERRORS,
      payload: { body: "Must not be empty" },
    });
    return;
  }
  if (newScreen.polls && newScreen.polls.length > 0) {
    let count = 0;
    for (let position = 0; position < newScreen.polls.length; position++) {
      const element = newScreen.polls[position];
      if (!element || (element && element.trim() === "")) count++;
      if (count === 2 || (count === 1 && newScreen.polls.length === 2)) {
        dispatch({
          type: ERROR,
          payload: "Atleast two option is required in polls",
        });
        dispatch({
          type: STOP_LOADING_UI,
        });
        return;
      }
    }
    count = 0;
    newScreen.pollsAttributes.pollsExpiry.forEach((v) => v === 0 && count++);
    if (count === 3) {
      dispatch({ type: ERROR, payload: "Please select poll expiry" });
      dispatch({
        type: STOP_LOADING_UI,
      });
      return;
    }
  }

  let formatedScreen = getFormatedScreen(newScreen);
  try {
    axios
      .post("/screen", formatedScreen)
      .then((res) => {
        console.log("Screen uploaded", res.data);
        dispatch({
          type: POST_SCREEN,
          payload: res.data.resScreen,
        });
        dispatch({
          type: CLEAR_ERRORS,
        });
      })
      .catch((err) => {
        console.log("Error received", err);
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,
        });
      });
  } catch (err) {}
};
//post a screen with media
export const postScreenWithMedia = (newScreen, body) => (dispatch) => {
  dispatch({
    type: LOADING_UI,
  });
  if (newScreen.polls.length > 0 && body === "") {
    dispatch({
      type: SET_ERRORS,
      payload: { body: "Must not be empty" },
    });
    return;
  }
  console.log("sending screen with media", newScreen);
  var data = new FormData();
  newScreen.files.map((file, index) => {
    console.log("items", file);
    if (newScreen.filename[index].includes("_preview"))
      return data.append(
        newScreen.filename[index],
        urltoFile(file, `${newScreen.filename[index]}.png`, "image/png")
      );
    else return data.append(newScreen.filename[index], file);
  });

  console.log("sending screen data ready", data);

  axios
    .post(`/screens/new/${body}`, data)
    .then((res) => {
      console.log("Screen uploaded", res.data);
      try {
        dispatch({
          type: POST_SCREEN,
          payload: res.data.resScreen,
        });
        dispatch({
          type: CLEAR_ERRORS,
        });
      } catch (err) {}
    })
    .catch((err) => {
      console.log("Error received", err.response.data);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};
function urltoFile(blob, filename, mimeType) {
  var arr = blob.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
//send poll response
export const addPollResponse = (screenId, response) => (dispatch) => {
  axios
    .post(`/screens/${screenId}/addPollResponse`, response)
    .then((res) => {
      console.log("Added ", res);
      dispatch({
        type: ADD_POLL_RESPONSE,
        payload: res.data,
      });
      dispatch({
        type: ADD_USER_POLL_RESPONSE,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
//like a screen
export const likeScreen = (screenId) => (dispatch) => {
  console.log("like screen clicked");
  axios
    .get(`/screens/${screenId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_SCREEN,
        payload: res.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: LIKE_SCREEN,
        payload: [],
      });
    });
};

//unlike a screen

export const unlikeScreen = (screenId) => (dispatch) => {
  axios
    .get(`/screens/${screenId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_SCREEN,
        payload: res.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: UNLIKE_SCREEN,
        payload: [],
      });
    });
};
//submit a commnet
export const submitComment = (screenId, commentData) => (dispatch) => {
  axios
    .post(`/screens/${screenId}/comments`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((error) => {
      try {
        console.log(error);
        dispatch({
          type: SET_ERRORS,
          payload: error.response.data,
        });
      } catch (err) {
        console.log(err);
      }
    });
};

//get user data
export const getUserData = (userHandle) => (dispatch) => {
  dispatch({
    type: LOADING_DATA,
  });

  axios
    .get(`/user/${userHandle}/${localStorage.getItem("handle")}`)
    .then((res) => {
      dispatch({
        type: SET_DATA,
        payload: res.data,
      });

      console.log("user Screen recieved", res.data.screens);
    })
    .catch((error) => {
      dispatch({
        type: SET_DATA,
      });
    });
};
export const deleteScreen = (screenId) => (dispatch) => {
  axios
    .delete(`/screens/${screenId}`)
    .then(() => {
      dispatch({
        type: DELETE_SCREEN,
        payload: screenId,
      });
    })
    .catch((error) => {
      console.error(error);
    });
};
export const clearErrors = () => (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
//get a screen
export const getScreen = (screenId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/screens/${screenId}`)
    .then((res) => {
      console.log("Screen recieved", res.data);
      dispatch({
        type: SET_SCREEN,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};
//get search result
export const getSearchResult = (query, filter) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  if (!query && query === "") return;
  if (Array.isArray(filter)) filter = { filter };
  filter["userHandle"] = localStorage.getItem("handle");
  console.log("searching ", "->" + query, filter);
  axios
    .post(`/search/${query}`, filter)
    .then((res) => {
      dispatch({
        type: SEARCH_DATA,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: STOP_LOADING_UI });
    });
};
//get news
export const getNews = (topic) => (dispatch) => {
  axios
    .get(`/news/${topic}`)
    .then((res) => {
      dispatch({
        type: NEWS_DATA,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
//get news
export const getFollowSuggestions = () => (dispatch) => {
  axios
    .get(`/user/suggestions`)
    .then((res) => {
      dispatch({
        type: FOLLOW_SUGGESTIONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getFollowersList = (handle) => (dispatch) => {
  console.log("getting followings");
  dispatch({ type: LOADING_UI });

  axios
    .get(`/followers/${handle}`)
    .then((res) => {
      dispatch({
        type: FOLLOW_LIST,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      dispatch({
        type: FOLLOW_LIST,
        payload: null,
        message: err.response.data.message,
      });
      dispatch({ type: STOP_LOADING_UI });
    });
};
export const getFollowingList = (handle) => (dispatch) => {
  console.log("getting followings");
  dispatch({ type: LOADING_UI });

  axios
    .get(`/following/${handle}`)
    .then((res) => {
      dispatch({
        type: FOLLOW_LIST,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      dispatch({
        type: FOLLOW_LIST,
        payload: null,
      });
      dispatch({ type: STOP_LOADING_UI });
    });
};
//get media
export const getUserMedia = (handle, type) => (dispatch) => {
  dispatch({
    type: LOADING_DATA,
  });
  axios
    .get(`/user/media/${handle}/${type}`)
    .then((res) => {
      console.log(res);
      dispatch({
        type: SET_MEDIA,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_MEDIA,
        payload: null,
      });
    });
};
//get user activity
export const getUserActivity = (handle, type) => (dispatch) => {
  dispatch({
    type: LOADING_DATA,
  });
  axios
    .get(`/user/activity/${handle}/${type}`)
    .then((res) => {
      console.log(res);
      // dispatch({
      //   type: SET_SCREENS,
      //   payload: res.data,
      // });
      dispatch({
        type: SET_DATA,
        payload: { screens: res.data },
      });
    })
    .catch((err) => {
      console.log(err);
      // dispatch({
      //   type: SET_SCREENS,
      //   payload: null,
      // });
      dispatch({
        type: SET_DATA,
        payload: {},
      });
    });
};
export const getScreenLikes = (screenId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/likes/${screenId}`)
    .then((res) => {
      dispatch({
        type: FOLLOW_LIST,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      dispatch({
        type: FOLLOW_LIST,
        payload: null,
        message: err.response.data.message,
      });
      dispatch({ type: STOP_LOADING_UI });
    });
};
export const getScreenPollVoters = (screenId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/votes/${screenId}`)
    .then((res) => {
      dispatch({
        type: FOLLOW_LIST,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: FOLLOW_LIST,
        payload: null,
        message: err.response.data.message,
      });
      dispatch({ type: STOP_LOADING_UI });
    });
};
