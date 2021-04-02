/* eslint-disable import/no-anonymous-default-export */
import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  SEARCH_ACTIVE,
  SEARCH_INACTIVE,
} from "../type";
const initialState = {
  loading: false,
  errors: null,
  searchActive: false,
  searchInactive: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null,
      };

    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false,
      };
    case SEARCH_ACTIVE:
      console.log("Data reducer", "search active");
      return {
        ...state,
        searchActive: true,
        searchInactive: false,
      };
    case SEARCH_INACTIVE:
      console.log("Data reducer", "search inactive");

      return {
        ...state,
        searchActive: false,
        searchInactive: true,
      };
    default:
      return state;
  }
}
