import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import {
  CommentTwoTone,
  FavoriteTwoTone,
  Movie,
  MusicNoteTwoTone,
  PhotoLibrary,
  PollTwoTone,
} from "@material-ui/icons";
import withWidth from "@material-ui/core/withWidth";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    zIndex: "auto",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function UseTab(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selected, setselected] = React.useState(0);
  const handleScreenClick = () => {
    if (selected !== 0) {
      setselected(0);
      props.handleTabChange(0);
    }
  };
  const handleImageClick = () => {
    if (selected !== 4) {
      setselected(4);
      props.handleTabChange(4);
    }
  };
  const handleVideoClick = () => {
    if (selected !== 5) {
      setselected(5);
      props.handleTabChange(5);
    }
  };
  const handleLikeClick = () => {
    if (selected !== 2) {
      setselected(2);
      props.handleTabChange(2);
    }
  };
  const handleCommentClick = () => {
    if (selected !== 3) {
      setselected(3);
      props.handleTabChange(3);
    }
  };
  const handlePollClicked = () => {
    if (selected !== 1) {
      setselected(1);
      props.handleTabChange(1);
    }
  };
  const handleDrawerOpen = () => {
    if (props.width !== "xs") setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleAudioClick = () => {
    if (selected !== 6) {
      setselected(6);
      props.handleTabChange(6);
    }
  };
  return (
    <div className={classes.root}>
      {/* <CssBaseline /> */}

      <Drawer
        variant="permanent"
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <Divider className={classes.toolbar} />

        <List>
          <ListItem
            button
            index={0}
            onClick={handleScreenClick}
            selected={selected === 0}
          >
            <ListItemIcon>
              <InboxIcon style={selected === 0 ? { color: "#369fff" } : null} />
            </ListItemIcon>
            <ListItemText primary={"Screens"} />
          </ListItem>
          <ListItem
            button
            index={1}
            onClick={handlePollClicked}
            selected={selected === 1}
          >
            <ListItemIcon>
              <PollTwoTone
                style={selected === 1 ? { color: "#369fff" } : null}
              />
            </ListItemIcon>
            <ListItemText primary={"Polls"} />
          </ListItem>

          <ListItem
            button
            index={2}
            onClick={handleLikeClick}
            selected={selected === 2}
          >
            <ListItemIcon>
              <FavoriteTwoTone
                style={selected === 2 ? { color: "#369fff" } : null}
              />
            </ListItemIcon>
            <ListItemText primary={"Liked Screens"} />
          </ListItem>
          <ListItem
            button
            index={3}
            onClick={handleCommentClick}
            selected={selected === 3}
          >
            <ListItemIcon>
              <CommentTwoTone
                style={selected === 3 ? { color: "#369fff" } : null}
              />
            </ListItemIcon>
            <ListItemText primary={"Commented Screens"} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            index={4}
            onClick={handleImageClick}
            selected={selected === 4}
          >
            <ListItemIcon>
              <PhotoLibrary
                style={selected === 4 ? { color: "#369fff" } : null}
              />
            </ListItemIcon>
            <ListItemText primary={"Images"} />
          </ListItem>
          <ListItem
            button
            index={5}
            onClick={handleVideoClick}
            selected={selected === 5}
          >
            <ListItemIcon>
              <Movie style={selected === 5 ? { color: "#369fff" } : null} />
            </ListItemIcon>
            <ListItemText primary={"Video"} />
          </ListItem>
          <ListItem
            button
            index={6}
            onClick={handleAudioClick}
            selected={selected === 6}
          >
            <ListItemIcon>
              <MusicNoteTwoTone
                style={selected === 6 ? { color: "#369fff" } : null}
              />
            </ListItemIcon>
            <ListItemText primary={"Audio"} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
export default withWidth()(UseTab);
