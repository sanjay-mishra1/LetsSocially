import React from "react";
import {
  Grid, // our UI Component to display the results
  SearchBar, // the search bar the user will type into
  SearchContext, // the context that wraps and connects our components
  SearchContextManager, // the context manager, includes the Context.Provider
  SuggestionBar, // an optional UI component that displays trending searches and channel / username results
} from "@giphy/react-components";
export const GifViewer = ({ selectGifFn, isSmall }) => {
  return (
    <SearchContextManager apiKey={"UVtZunhQ21GZ4RCOGOaADugOdXrkJ29h"}>
      <Components selectGifFn={selectGifFn} isSmall={isSmall} />
    </SearchContextManager>
  );
};

// define the components in a separate function so we can
// use the context hook. You could also use the render props pattern
const Components = ({ selectGifFn, isSmall }) => {
  const { fetchGifs, searchKey } = React.useContext(SearchContext);
  return (
    <>
      <SearchBar />
      <SuggestionBar />
      <Grid
        onGifClick={selectGifFn}
        key={searchKey}
        columns={3}
        width={isSmall ? window.innerWidth : 560}
        fetchGifs={fetchGifs}
      />
    </>
  );
};
