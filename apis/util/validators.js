const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};
const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};
exports.validateSignUpData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }
  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Password is not same";
  }
  if (isEmpty(data.handle)) {
    errors.handle = "Must not be empty";
  }
  if (isEmpty(data.username)) {
    errors.username = "Must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserDetails = (data) => {
  //bio loc, website
  let userDetails = {};
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http")
      userDetails.website = `http://${data.website.trim()}`;
    else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;
  if (!isEmpty(data.username.trim()))
    userDetails.username = data.username.toLowerCase();

  return userDetails;
};
exports.removePreviews = (data) => {
  return data.filter((item) => !item.includes("_preview"));
};
exports.getHashtags = (message) => {
  let hashtag = [];
  if (message) {
    hashtag = message.match(/#\S+/g);

    if (hashtag && hashtag.length > 0)
      return hashtag.map((item) => item.replace("#", ""));
    else return null;
  } else return null;
};
exports.validatePollsResponseAccess = async (
  db,
  pollsData,
  screenUserHandle,
  userHandle,
  myFriendsList
) => {
  try{
    console.log("TYPE IS ", pollsData.pollsAttributes.pollsType.toUpperCase());
    if (screenUserHandle === userHandle) return true;
    if (!pollsData.pollsAttributes.pollsType.toUpperCase().includes("EVERYONE")) {
      if (myFriendsList !== undefined) {
        if (myFriendsList.includes(userHandle)) return true;
        else return false;
      }
  
      let handlerData = await db.doc(`users/${pollsData.userHandle}`).get();
      handlerData = handlerData.data();
      if (
        (handlerData.followers_list &&
          !handlerData.followers_list.includes(userHandle)) ||
        (handlerData.following_list &&
          !handlerData.following_list.includes(userHandle))
      )
        return false;
      // return res
      //   .status(403)
      //   .json({ error: "You are not allowed to give response in this poll" });
      else {
        console.log(
          "not returning",
          handlerData.followers_list,
  
          handlerData.following_list
        );
        console.log(
          !handlerData.followers_list.includes(req.user.handle),
          !handlerData.following_list.includes(req.user.handle)
        );
        return true;
      }
    }}catch(err){
      return null;
    }
};
