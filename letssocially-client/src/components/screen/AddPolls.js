import {
  Button,
  Card,
  Divider,
  fade,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Popper,
  TextField,
} from "@material-ui/core";
import { Add, GroupTwoTone, People, PublicTwoTone } from "@material-ui/icons";
import React, { Component } from "react";
import withStyle from "@material-ui/core/styles/withStyles";
import { Fragment } from "react";
const style = (theme) => ({
  root: {
    marginTop: 10,
    marginBottom: 10,
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 500,
    [theme.breakpoints.down("xs")]: {
      width: 300,
    },
  },
  daysBox: {
    width: 146,
    margin: 10,
    [theme.breakpoints.down("xs")]: {
      width: 80,
      margin: 10,
    },
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
});
class AddPolls extends Component {
  state = {
    options: [],
    days: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      57,
      58,
      59,
    ],
    expiry: [0, 0, 0],
    anchorEl: null,
    type: ["Days", "Hours", "Minutes"],
    value: [8, 24, 60],
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };
  componentDidMount() {
    this.state.options.push(...this.props.polls);
  }
  addOptions = () => {
    var option = this.state.options;
    option.push("");
    this.setState({ options: option });
  };
  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };
  openMenu = (e) => {
    this.setState({ anchorEl: e.currentTarget });
  };
  handleMenuItemClick = () => {
    setTimeout(() => {
      this.handleMenuClose();
    }, 100);
  };
  handleEveryOneClick = () => {
    this.props.handlePollsType("Everyone can reply");
    this.handleMenuItemClick();
  };
  handleFollowerClick = () => {
    this.props.handlePollsType("People you follow");
    this.handleMenuItemClick();
  };
  handleDayExpiryChange = (e) => {
    console.log("option", e.target.value);
    this.props.handleChangeInPollsExpiry(e.target.value, 0);
  };
  handleHourExpiryChange = (e) => {
    console.log("option", e.target.value);
    this.props.handleChangeInPollsExpiry(e.target.value, 1);
  };
  handleMinuteExpiryChange = (e) => {
    console.log("option", e.target.value);
    this.props.handleChangeInPollsExpiry(e.target.value, 2);
  };
  render() {
    console.log("Inside pools", this.props);
    return (
      <React.Fragment>
        {this.props.polls.length !== 0 && (
          <Card variant="outlined">
            <Grid container justify="center">
              {this.props.polls.map((item, index) => (
                <Grid item key={index}>
                  <Paper className={this.props.classes.root}>
                    <InputBase
                      className={this.props.classes.input}
                      onChange={this.props.handleChange}
                      id={index}
                      value={item}
                      spellCheck="false"
                      autoComplete="off"
                      placeholder={"Choice " + (index + 1)}
                      inputProps={{ "aria-label": "Add option" }}
                    />

                    {this.props.polls.length < 4 &&
                      index === this.props.polls.length - 1 && (
                        <Fragment>
                          <Divider
                            className={this.props.classes.divider}
                            orientation="vertical"
                          />
                          <IconButton
                            color="primary"
                            className={this.props.classes.iconButton}
                            aria-label="add"
                            onClick={this.props.pollonAdd}
                          >
                            <Add />
                          </IconButton>
                        </Fragment>
                      )}
                  </Paper>
                </Grid>
              ))}

              <Grid
                item
                sm={12}
                xs={12}
                justify="center"
                alignContent="center"
                style={{ textAlignLast: "center" }}
              >
                <Divider />
                <p style={{ textAlignLast: "auto", marginLeft: 35 }}>
                  Poll Length
                </p>
                <RedditTextField
                  variant="filled"
                  select
                  className={this.props.classes.daysBox}
                  label={this.state.type[0]}
                  onChange={this.handleDayExpiryChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  {this.state.days
                    .slice(0, this.state.value[0])
                    .map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </RedditTextField>
                <RedditTextField
                  variant="filled"
                  select
                  className={this.props.classes.daysBox}
                  label={this.state.type[1]}
                  onChange={this.handleHourExpiryChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  {this.state.days
                    .slice(0, this.state.value[1])
                    .map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </RedditTextField>
                <RedditTextField
                  variant="filled"
                  select
                  className={this.props.classes.daysBox}
                  label={this.state.type[2]}
                  onChange={this.handleMinuteExpiryChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  {this.state.days
                    .slice(0, this.state.value[2])
                    .map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </RedditTextField>
              </Grid>
              <Grid item sm={12} xs={12}>
                <Divider />

                <Button
                  variant="text"
                  color="primary"
                  // ref={anchorRef}
                  startIcon={
                    this.props.pollsType.includes("Everyone") ? (
                      <PublicTwoTone color="primary" />
                    ) : (
                      <People color="primary" />
                    )
                  }
                  fullWidth
                  onClick={this.openMenu}
                  style={{ textTransform: "none" }}
                >
                  {this.props.pollsType}
                </Button>

                <StyledMenu
                  id="customized-menu"
                  anchorEl={this.state.anchorEl}
                  keepMounted
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleMenuClose}
                >
                  <StyledMenuItem onClick={this.handleEveryOneClick}>
                    <ListItemIcon>
                      <PublicTwoTone fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Everyone can reply" />
                  </StyledMenuItem>
                  <StyledMenuItem onClick={this.handleFollowerClick}>
                    <ListItemIcon>
                      <GroupTwoTone fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="People you follow" />
                  </StyledMenuItem>
                </StyledMenu>
              </Grid>
              <Grid item sm={12} xs={12}>
                <Divider />
                <Button
                  variant="text"
                  fullWidth
                  onClick={this.props.pollonRemove}
                  autoCapitalize={false}
                  style={{ color: "red" }}
                >
                  Remove Poll
                </Button>
              </Grid>
            </Grid>
          </Card>
        )}
      </React.Fragment>
    );
  }
}
const StyledMenu = withStyle({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    anchorEl={props.anchorEl}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyle((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStylesReddit = makeStyles((theme) => ({
  root: {
    border: "1px solid #e2e2e1",
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: "#fcfcfb",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:hover": {
      backgroundColor: "#fff",
    },
    "&$focused": {
      backgroundColor: "#fff",
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
  focused: {},
}));

function RedditTextField(props) {
  const classes = useStylesReddit();

  return (
    <TextField InputProps={{ classes, disableUnderline: true }} {...props} />
  );
}
export default withStyle(style)(AddPolls);
