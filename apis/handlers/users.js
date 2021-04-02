const { admin, db } = require("../util/admin");
const { getSuggestions, addUser, editUser, test } = require("./sql");
const config = require("../util/config");
const firebase = require("firebase");
firebase.initializeApp(config);
const {
  validateSignUpData,
  validateLoginData,
  reduceUserDetails,
  validatePollsResponseAccess,
} = require("../util/validators");
const https = require("https");

exports.uploadTempImage = async (req, res) => {
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    var files = [];
    for (const file of req.files) {
      const { fieldname, originalname, encoding, mimetype, buffer } = file;
      console.log("uploading file", file);
      try {
        var name = new Date().getTime().toString();
        let url = await uploadImageToStorage(file);
        files.push(url);
      } catch (err) {
        console.log(err);
      }
    }
  }
  res.json({
    message: "Image uploaded successfully",
    url: files,
    data: req.body.test,
  });
};
const uploadImageToStorage = (file) => {
  let prom = new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = "aa-test-" + new Date().getTime() + ".jpg"; //uqiue name

    let fileUpload = admin
      .storage()
      .bucket()
      .file("1111/" + newFileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.log(error);
      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", () => {
      const url = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/1111%2F${newFileName}?alt=media`;
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
  return prom;
};
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
    username: req.body.username,
  };
  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) return res.status(400).json({ errors });
  const noImg = "no-image.png";
  let authToken = "";
  let userId;
  // TODO validate user
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: `This handle is already taken` });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
          .then((data) => {
            userId = data.user.uid;
            addUser(newUser);
            return data.user.getIdToken();
          })
          .then((token) => {
            authToken = token;
            const userCredentials = {
              handle: newUser.handle,
              email: newUser.email,
              username: newUser.username.toLowerCase(),
              createdAt: new Date().toISOString(),
              userId: userId,
              followers: 0,
              imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
          })
          .then(() => {
            return res.status(201).json({ token: authToken });
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
              return res.status(400).json({ email: "Email already in use" });
            } else {
              return res
                .status(500)
                .json({ general: "Something went wrong, please try again" });
            }
          });
      }
    });
};
exports.login = (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json({ errors });
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then((data) => {
        return data.user.getIdToken();
      })
      .then((token) => {
        return res.status(200).json({ token });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(403)
          .json({ gerneral: "Wrong credentials, please try again later" });
      });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: err });
  }
};
const parcelCase = (name) => {
  return name.replace(/\w+/g, function (w) {
    return w[0].toUpperCase() + w.slice(1).toLowerCase();
  });
};
//get other user detail
exports.getUserDetail = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        userData.user.username = parcelCase(userData.user.username);
        if (
          doc.data().followers_list &&
          doc.data().followers_list.includes(req.params.currentHandle)
        )
          userData.user.is_following = true;
        console.log(
          "user data",
          userData,
          "current user handle",
          req.params.currentHandle
        );
        return db
          .collection("screens")
          .orderBy("createdAt", "desc")
          .where("userHandle", "==", req.params.handle)
          .get();
      } else {
        res.status(404).json({ error: "User not exist" });
      }
    })
    .then((data) => {
      userData.screens = [];
      console.log(data);
      data.forEach((doc) => {
        let store = {
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          screenId: doc.id,
          screenMedia: doc.data().screenMedia,
        };
        if (doc.data().polls) {
          store.polls = {
            polls: doc.data().polls,
            pollsAttributes: doc.data().pollsAttributes,
            userAllowedToRespond: validatePollsResponseAccess(
              null,
              null,
              doc.data().userHandle,
              req.params.currentHandle,
              userData.user.followers_list
            ),
          };
        }
        userData.screens.push(store);
      });

      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfully" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: error.code });
    });
};
//upload user profile image
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  console.log("user image headers", req.headers);
  const busBoy = new BusBoy({ headers: req.headers });
  let imageFileName;
  let imageToBeUploaded = {};
  busBoy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png")
      return res.status(500).json({ error: "wrong file type selected" });
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(Math.random() * 100000)}.` + imageExtension;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busBoy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        destination: `${req.user.handle}/${imageFileName}`,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
            uploadFrom: "Profile image",
          },
        },
      })
      .then(() => {
        // const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${req.user.handle}%2F${imageFileName}?alt=media`;

        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully" });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).join({ error });
      });
  });
  busBoy.end(req.rawBody);
};
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        userData.credentials.username = parcelCase(
          userData.credentials.username
        );
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("polls")
        .where("userHandle", "==", req.user.handle)
        .get();
    })
    .then((data) => {
      userData.pollsResponse = [];
      data.forEach((doc) => {
        userData.pollsResponse.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screenId: doc.data().screenId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      });
      return res.json({ userData });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: error.code });
    });
};
exports.markNotificationRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked read" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: error.code });
    });
};
//news
exports.getTrandingNews = (req, res) => {
  let url;

  if (req.params.topic && req.params.topic !== "all")
    url = `https://newsapi.org/v2/everything?q=${req.params.topic}&language=en&from=2020-11-28&sortBy=popularity&apiKey=ec112318dada4c66a9a8ddc5ab5435b8`;
  else
    url =
      "https://newsapi.org/v2/top-headlines?country=in&apiKey=ec112318dada4c66a9a8ddc5ab5435b8";
  https
    .get(url, (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        return res.json(getTopRecord(JSON.parse(data)));
      });
    })
    .on("error", (err) => {
      return res.status(500).json({ error: err.message });
    });
};
const getTopRecord = (data) => {
  news = [];
  let count = 0;
  const maxLimit = 5;
  if (data.status === "ok") {
    data.articles.every((item) => {
      count++;
      news.push({
        title: item.title.includes("-")
          ? item.title.substring(0, item.title.lastIndexOf("-") - 1)
          : item.title,
        url: item.url,
        imageUrl: item.urlToImage,
        type: "news",
      });
      if (count === maxLimit) {
        return false;
      } else return true;
    });
  }
  return news;
};
//follow user
exports.followUser = (req, res) => {
  if (!req.params.handle)
    return res.status(404).json({ error: "User not found" });
  let count = 0;
  addfollowUser(req.params.handle, req.user.handle, [
    "following",
    "following_list",
  ])
    .then(() => {
      count = count + 1;
      if (count == 2) {
        res.json({ message: "Followed successfully" });
        editUser(req.params.handle, 1);
      }
    })
    .catch((err) => {
      console.log(err);
      try {
        res.status(400).json({
          error: "An unexpected error occurred. Please try again later.",
        });
      } catch (er) {}
    });
  addfollowUser(req.user.handle, req.params.handle, [
    "followers",
    "followers_list",
  ])
    .then(() => {
      count = count + 1;
      if (count == 2) {
        res.json({ message: "Followed successfully" });
        editUser(req.params.handle, 1);
      }
    })
    .catch((err) => {
      console.log(err);
      try {
        res.status(400).json({
          error: "An unexpected error occurred. Please try again later.",
        });
      } catch (er) {}
    });
};
const addfollowUser = async (toFollowHandle, forHandle, dataToUpdate) => {
  await db
    .doc(`/users/${forHandle}`)
    .get()
    .then((doc) => {
      if (!doc.exists) return new Error("User not found");
      else {
        let count;
        let list;
        if (dataToUpdate[0].includes("following")) {
          count = doc.data().following;
        } else count = doc.data().followers;
        if (count !== undefined && count != 0) {
          count = count + 1;
          list = admin.firestore.FieldValue.arrayUnion(toFollowHandle);
        } else {
          count = 1;
          list = [toFollowHandle];
        }
        let finalData = {};
        finalData[[dataToUpdate[0]]] = count;
        finalData[[dataToUpdate[1]]] = list;
        db.doc(`/users/${forHandle}`).update(finalData);
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      throw new Error("Server error occurred");
    });
};
//unfollow user
exports.unfollowUser = (req, res) => {
  if (!req.params.handle)
    return res.status(404).json({ error: "User not found" });
  let count = 0;
  addUnfollowUser(req.params.handle, req.user.handle, [
    "following",
    "following_list",
  ])
    .then(() => {
      count = count + 1;
      if (count == 2) {
        res.json({ message: "Unfollowed successfully" });
        editUser(req.params.handle, -1);
      }
    })
    .catch((err) => {
      console.log(err);
      try {
        res.status(400).json({
          error: "An unexpected error occurred. Please try again later.",
        });
      } catch (er) {}
    });
  addUnfollowUser(req.user.handle, req.params.handle, [
    "followers",
    "followers_list",
  ])
    .then(() => {
      count = count + 1;
      if (count == 2) {
        res.json({ message: "Unfollowed successfully" });
        editUser(req.params.handle, -1);
      }
    })
    .catch((err) => {
      console.log(err);
      try {
        res.status(400).json({
          error: "An unexpected error occurred. Please try again later.",
        });
      } catch (er) {
        return;
      }
    });
};
const addUnfollowUser = async (toFollowHandle, forHandle, dataToUpdate) => {
  await db
    .doc(`/users/${forHandle}`)
    .get()
    .then((doc) => {
      if (!doc.exists) return new Error("User not found");
      else {
        let count;
        let list;
        if (dataToUpdate[0].includes("following")) {
          count = doc.data().following;
        } else count = doc.data().followers;

        count = count - 1;
        list = admin.firestore.FieldValue.arrayRemove(toFollowHandle);
        let finalData = {};
        finalData[[dataToUpdate[0]]] = count;
        finalData[[dataToUpdate[1]]] = list;

        db.doc(`/users/${forHandle}`).update(finalData);
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      throw new Error("Server error occurred");
    });
};
//followers
exports.getFollowers = (req, res) => {
  const followers = [];
  if (req.user.handle === req.params.handle) {
    db.doc(`users/${req.user.handle}`)
      .get()
      .then((doc) => {
        if (doc.data().followers && doc.data().followers > 0) {
          getUserListDetails(req, res, doc.data().followers_list, followers);
        } else return res.status(400).json({ message: "No followers found" });
      });
  } else {
    db.doc(`users/${req.user.handle}`)
      .get()
      .then((doc) => {
        if (
          doc.data().following &&
          doc.data().following > 0 &&
          doc.data().following_list.includes(req.params.handle)
        ) {
          db.doc(`users/${req.params.handle}`)
            .get()
            .then((d) => {
              console.log(
                "Followers of ",
                req.params.handle,
                d.data().followers_list
              );
              getUserListDetails(req, res, d.data().followers_list, followers);
            });
        } else
          return res
            .status(400)
            .json({ message: "Follow this user to see their followers" });
      });
  }
};

//receive user handle list and add user detail and return the response
const getUserListDetails = async (req, res, followers_list, followers) => {
  let count = 0;
  followers_list.map((item) => {
    db.doc(`users/${item}`)
      .get()
      .then((data) => {
        count = count + 1;
        followers.push({
          username: parcelCase(data.data().username),
          userImage: data.data().imageUrl,
          userHandle: data.data().handle,
        });
        if (count === followers_list.length) {
          console.log("followers details", followers);
          return res.json(followers);
        }
      });
  });
};
//followings
exports.getFollowing = (req, res) => {
  const following = [];
  if (req.user.handle === req.params.handle) {
    db.doc(`users/${req.user.handle}`)
      .get()
      .then((doc) => {
        if (doc.data().following && doc.data().following > 0) {
          getUserListDetails(req, res, doc.data().following_list, following);
        } else
          return res.status(400).json({ message: "No following user found" });
      });
  } else {
    db.doc(`users/${req.user.handle}`)
      .get()
      .then((doc) => {
        if (
          doc.data().following &&
          doc.data().following > 0 &&
          doc.data().following_list.includes(req.params.handle)
        ) {
          db.doc(`users/${req.params.handle}`)
            .get()
            .then((d) => {
              console.log(
                "following of ",
                req.params.handle,
                d.data().following_list
              );
              getUserListDetails(req, res, d.data().following_list, following);
            });
        } else
          return res
            .status(400)
            .json({ message: "Follow this user to see their followings" });
      });
  }
};

//search result
exports.getSearchResult = (req, res) => {
  try {
    var filter = req.body.filter;
    if (!Array.isArray(filter) || filter === null || filter.length === 0)
      return res.status(400).json({ error: "No filters found" });
    console.log("filter", filter);
    var filterJson = {
      users: "handle",
      email: "email",
      username: "username",
      followers: "followers",
      username: "username",
      screens: "screens",
      hashtag: "hashtag",
    };
    let searchResult = [];
    //filter=> user,name,email screen hashtag
    var searchKey = req.params.query;
    var count = 0;
    var handleList = [];
    filter.forEach((item) => {
      var key, value;
      if (item.includes("-")) {
        key = item.split("-")[0];
        value = filterJson[item.split("-")[1]];
      } else {
        key = item;
        value = filterJson[item];
      }
      console.log("value", value);
      if (value === "followers")
        getUserFollowerArray(
          req.body.userHandle,
          handleList,
          searchKey,
          searchResult,
          res
        );
      else
        fetchUserData(
          req.body.userHandle,
          key,
          value,
          searchKey,
          searchResult,
          handleList
        ).then(() => {
          count++;
          if (count === filter.length) return res.json({ searchResult });
        });
    });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
const getUserFollowerArray = async (handle, searchKey, searchResult, res) => {
  if (!handle || handle === "") return;
  let doc = await db.doc(`users/${handle}`).get();
  let myFriends = [];
  myFriends = doc
    .data()
    .followers_list.filter((handle) => handle.includes(searchKey));
  console.log(myFriends);
  if (doc.data().following_list)
    myFriends = [
      ...new Set([
        ...myFriends,
        ...doc
          .data()
          .following_list.filter((handle) => handle.includes(searchKey)),
      ]),
    ];
  myFriends.forEach((handle) => {
    db.doc(`users/${handle}`)
      .get()
      .then((doc) => {
        if (!handleList.includes(doc.id)) {
          handleList.push(doc.id);
          searchResult.push({
            userHandle: doc.id,
            username: parcelCase(doc.data().username),
            userImage: doc.data().imageUrl,
            type: type,
          });
        }
      });
  });
};
async function fetchUserData(
  userHandle,
  key,
  fieldname,
  value,
  searchResult,
  handleList
) {
  if (fieldname.includes("username")) value = parcelCase(value);
  console.log("searchkey", value, "key", key, "fieldname", fieldname);

  let ref = db.collection(key);
  if (!["hashtag", "screens"].includes(fieldname)) {
    ref = ref
      .orderBy(fieldname)
      .startAt(value)
      .endAt(value + "\uf8ff");
  } else ref = ref.where(fieldname, "array-contains", value);
  await ref
    .get()
    .then((data) => {
      setUserData(data, userHandle, key, handleList, searchResult);
      console.log("result", searchResult);
      return searchResult;
    })
    .catch((err) => {
      console.log(err);
      return;
    });
}
const setUserData = (data, userHandle, type, handleList, searchResult) => {
  data.forEach((doc) => {
    if (userHandle !== doc.id) {
      console.log("doc.id", doc.id);
      if (!handleList.includes(doc.id)) {
        handleList.push(doc.id);
        if (type === "users")
          searchResult.push({
            userHandle: doc.id,
            username: parcelCase(doc.data().username),
            userImage: doc.data().imageUrl,
            type: type,
          });
        else {
          let screen = doc.data();
          screen.screenId = doc.id;
          screen.type = "screens";
          searchResult.push(screen);
        }
      }
    }
  });
};
exports.getFollowSuggestions = async (req, res) => {
  let doc = await db.doc(`users/${req.user.handle}`).get();
  let myFriends = [];
  let suggestionList = [];
  if (doc.data().followers_list) myFriends = [...doc.data().followers_list];
  console.log(myFriends);
  if (doc.data().following_list)
    myFriends = [...new Set([...myFriends, ...doc.data().following_list])];
  console.log(myFriends);
  myFriends.push(req.user.handle);
  console.log(myFriends);
  let handleList = await getSuggestions(myFriends);
  console.log("List", handleList, typeof handleList, handleList.length);
  let listSize = handleList.length;
  if (handleList.length > 0) {
    handleList.forEach((handle) => {
      db.doc(`users/${handle.userHandle}`)
        .get()
        .then((doc) => {
          if (doc.exists)
            suggestionList.push({
              username: parcelCase(doc.data().username),
              userImage: doc.data().imageUrl,
              userHandle: doc.data().handle,
            });
          else listSize--;
          if (suggestionList.length === listSize)
            return res.json(suggestionList);
        });
    });
  } else res.json({ message: "Not found" });
};
exports.test = async (req, res) => {
  let doc = await test(req.body.query);
  // var doc = await db
  //   .collection("users")
  //   .get()
  //   .then((doc) => {
  //     var s = [];
  //     doc.forEach((data) => addUser({ screenId: data.id, ...data.data() }));
  //     res.json(s);
  //   });
  res.json({ responseType: typeof response, doc });
};
