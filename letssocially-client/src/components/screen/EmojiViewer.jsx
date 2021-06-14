import React from "react";
import Axios from "axios";
import Divider from "@material-ui/core/Divider";
import MyButton from "../../util/MyButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  CircularProgress,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { EmojiEmotions } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";

const EmojiViewer = ({
  selectEmojiFn,
  setEmojiVisibilityFn,
  showEmoji,
  isSmall,
}) => {
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [emojis, setEmojies] = React.useState([]);
  const [searchKey, setSearchKey] = React.useState("");
  React.useEffect(() => {
    console.log("emoji api call");
    const getEmojis = () => {
      Axios.get(
        "https://emoji-api.com/emojis?access_key=0663f785d186545e182882a62ad6c432f58ee813"
      )
        .then((emojis) => {
          setErrorMsg("");
          setEmojies(emojis.data);
        })
        .catch((err) => {
          setErrorMsg("An error occurred");
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getEmojis();
  }, [showEmoji]);
  const emojiSearchKey = (event) => {
    setSearchKey(event.target.value.toLowerCase());
  };
  const filteredEmojis =
    emojis.length > 0 &&
    emojis.filter(
      (item) =>
        item.group.includes(searchKey) ||
        item.slug.includes(searchKey) ||
        item.subGroup.includes(searchKey) ||
        item.unicodeName.includes(searchKey)
    );
  return (
    <React.Fragment>
      {!loading && !errorMsg && (
        <div className="emoji-box-header">
          <MyButton tip="Close" onClick={setEmojiVisibilityFn}>
            <ExpandMoreIcon />
          </MyButton>
          {!isSmall && <p>Select Emojies</p>}
          <SearchBar setSearchText={emojiSearchKey} />
        </div>
      )}
      <div className="emoji-box">
        <Divider></Divider>
        {filteredEmojis && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {filteredEmojis.map((emoji, index) => (
              <div
                onClick={() => selectEmojiFn(emoji.character)}
                className="emoji-icon-box"
                key={index}
              >
                <span>{emoji.character}</span>
              </div>
            ))}
          </div>
        )}
        {errorMsg && <p>{errorMsg}</p>}
        {loading && (
          <div style={{ display: "flex", margin: 5, placeContent: "center" }}>
            <CircularProgress size={30} />
            <p style={{ marginTop: 3, marginLeft: 5 }}>Loading emojis</p>
          </div>
        )}
        <Divider></Divider>
      </div>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "16em",
    display: "flex",
    padding: "2px 4px",
    alignItems: "center",
    height: "2.6em",
    marginLeft: "auto",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

function SearchBar({ setSearchText }) {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <EmojiEmotions />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <InputBase
        className={classes.input}
        placeholder="Search Emoji"
        inputProps={{ "aria-label": "search Emoji" }}
        onChange={setSearchText}
        name="emojiSearchKey"
      />
      <IconButton
        type="submit"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
export default EmojiViewer;
