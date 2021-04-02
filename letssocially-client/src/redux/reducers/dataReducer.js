import store from "../store";
import {
  SET_SCREENS,
  LIKE_SCREEN,
  UNLIKE_SCREEN,
  LOADING_DATA,
  DELETE_SCREEN,
  POST_SCREEN,
  SET_SCREEN,
  SUBMIT_COMMENT,
  SEARCH_DATA,
  NEWS_DATA,
  FOLLOW_LIST,
  FOLLOW_SUGGESTIONS,
  SET_MEDIA,
  ADD_POLL_RESPONSE,
  SET_DATA,
  HANDLE_FOLLOWING_LIST,
  STOP_LOADING_DATA,
} from "../type";
const initialState = {
  screens: [],
  screen: {},
  loading: false,
  user: { screens: [], user: {} },
};
// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, actions) {
  switch (actions.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING_DATA:
      return {
        ...state,
        loading: false,
      };
    case HANDLE_FOLLOWING_LIST:
      console.log(state, "payload", actions.payload);
      const credentials = state.user.user;
      const isFollower = actions.payload.isFollower;
      console.log(actions.payload, credentials);
      if (credentials) {
        if (isFollower) {
          if (credentials.followers)
            credentials.followers =
              credentials.followers + actions.payload.value;
          else credentials.followers = 1;
        } else {
          if (credentials.following)
            credentials.following =
              credentials.following + actions.payload.value;
          else credentials.following = 1;
        }

        if (isFollower) {
          if (credentials.followers_list) {
            if (actions.payload.value === 1)
              credentials.followers_list.push(actions.payload.userHandle);
            else {
              const index = credentials.followers_list.indexOf(
                actions.payload.userHandle
              );
              if (index > -1) {
                credentials.followers_list.splice(index, 1);
              }
            }
          } else {
            credentials.followers_list = [];
            if (actions.payload.value === 1)
              credentials.followers_list.push(actions.payload.userHandle);
          }
        } else {
          if (credentials.following_list) {
            if (actions.payload.value === 1)
              credentials.following_list.push(actions.payload.userHandle);
            else {
              const index = credentials.following_list.indexOf(
                actions.payload.userHandle
              );
              if (index > -1) {
                credentials.following_list.splice(index, 1);
              }
            }
          } else {
            credentials.following_list = [];
            if (actions.payload.value === 1)
              credentials.following_list.push(actions.payload.userHandle);
          }
        }
      }
      return {
        ...state,
        users: { user: credentials },
      };
    case SET_DATA: {
      let data = {};
      try {
        console.log(actions.payload);
        if (
          actions.payload &&
          actions.payload.hasOwnProperty("screens")
          // actions.payload.screens > 0
        )
          data.screens = actions.payload.screens;
        else data.screens = state.user.screens;
        if (actions.payload && actions.payload.hasOwnProperty("user"))
          data.user = actions.payload.user;
        else data.user = state.user.user;
      } catch (error) {
        console.log(error);
        console.log(state);
      }
      return {
        ...state,
        // user: { ...actions.payload },
        user: data,
        loading: false,
      };
    }
    case SET_SCREENS:
      return {
        ...state,
        loading: false,
        screens: actions.payload,
      };
    case LIKE_SCREEN:
    case UNLIKE_SCREEN:
      let index = state.screens.findIndex(
        (screen) => screen.screenId === actions.payload.screenId
      );
      state.screens[index] = actions.payload;
      if (state.screen.screenId === actions.payload.screenId) {
        state.screen.likeCount = actions.payload.likeCount;
      }

      //in other user screen
      let index2 = state.user.screens.findIndex(
        (screen) => screen.screenId === actions.payload.screenId
      );
      state.user.screens[index2] = actions.payload;
      if (state.screen.screenId === actions.payload.screenId) {
        state.screen.likeCount = actions.payload.likeCount;
      }

      console.log("new screens", state.screens);
      return {
        ...state,
        screen: state.screen,
        user: { ...state.user },
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        screen: {
          ...state.screen,
          comments: [actions.payload, ...state.screen.comments],
        },
      };
    case ADD_POLL_RESPONSE:
      console.log(state.screens);
      let i = state.screens.findIndex(
        (screen) => screen.screenId === actions.payload.screenId
      );

      state.screens[i].polls.polls[actions.payload.response].votes += 1;
      state.screens[i].key = state.screens[i].screenId + "1";

      console.log(state.screens[i]);
      return {
        ...state,
        screens: state.screens,
      };
    case DELETE_SCREEN:
      let ind = state.screens.findIndex(
        (screen) => screen.screenId === actions.payload
      );
      state.screens.splice(ind, 1);
      return {
        ...state,
      };
    case SET_SCREEN:
      console.log("data received ", actions.payload);
      return {
        ...state,
        loading: false,
        screen: actions.payload,
      };
    case SET_MEDIA:
      return {
        ...state,
        loading: false,
        media: actions.payload,
      };
    case POST_SCREEN:
      return {
        ...state,
        open: false,
        screens: [actions.payload, ...state.screens],
      };

    case SEARCH_DATA:
      console.log(actions.payload);
      try {
        return {
          searchActive: true,
          searchInactive: false,
          ...state,
          searchResult: actions.payload.searchResult,
        };
      } catch (e) {
        return {
          searchActive: true,
          searchInactive: false,
          ...state,
          searchResult: actions.payload,
        };
      }
    case NEWS_DATA:
      console.log("news received", actions.payload);
      return {
        ...state,
        news: actions.payload,
      };
    case FOLLOW_LIST:
      console.log("received follow list", actions.payload);
      return {
        ...state,
        usersList: actions.payload,
      };
    case FOLLOW_SUGGESTIONS:
      return {
        ...state,
        suggestions: actions.payload,
      };
    default:
      return state;
  }
}
