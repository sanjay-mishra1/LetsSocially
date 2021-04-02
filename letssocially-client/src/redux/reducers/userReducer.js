/* eslint-disable import/no-anonymous-default-export */
import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SCREEN,
  UNLIKE_SCREEN,
  MARK_NOTIFICATIONS_READ,
  ERROR,
  MESSAGE,
  CLEAR_CUSTOM_MESSAGE,
  ADD_USER_POLL_RESPONSE,
  HANDLE_FOLLOWING_LIST,
} from "../type";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
  error: "",
  message: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    // case HANDLE_FOLLOWING_LIST:
    //   console.log(state, "payload", action.payload);
    //   const credentials = state.credentials;
    //   if (credentials) {
    //     if (credentials.following)
    //       credentials.following = credentials.following + action.payload.value;
    //     else credentials.following = 1;
    //     if (credentials.following_list) {
    //       if (action.payload.value === 1)
    //         credentials.following_list.push(action.payload.userHandle);
    //       else {
    //         const index = credentials.following_list.indexOf(
    //           action.payload.userHandle
    //         );
    //         if (index > -1) {
    //           credentials.following_list.splice(index, 1);
    //         }
    //       }
    //     } else {
    //       credentials.following_list = [];
    //       if (action.payload.value === 1)
    //         credentials.following_list.push(action.payload.userHandle);
    //     }
    //   }
    //   return {
    //     ...state,
    //     credentials,
    //   };
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case LIKE_SCREEN:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            screenId: action.payload.screenId,
          },
        ],
      };
    case UNLIKE_SCREEN:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.screenId !== action.payload.screenId
        ),
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((not) => (not.read = true));
      return {
        ...state,
      };
    case ERROR:
      console.log("dispatching error", action.payload);
      return {
        ...state,
        error: action.payload,
      };
    case MESSAGE:
      console.log("dispatching message", action.payload);
      return {
        ...state,
        message: action.payload,
      };
    case CLEAR_CUSTOM_MESSAGE:
      return {
        ...state,
        message: null,
        error: null,
      };
    case ADD_USER_POLL_RESPONSE:
      state.pollsResponse.push(action.payload);
      return {
        ...state,
      };
    default:
      return state;
  }
}
