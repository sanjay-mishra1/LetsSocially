const { admin, db } = require("../util/admin");
const { getScreens, addScreens, deleteScreen } = require("./sql");
const config = require("../util/config");
const {
  getHashtags,
  removePreviews,
  validatePollsResponseAccess,
} = require("../util/validators");
exports.getAllScreens = (req, res) => {
  db.collection("screens")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screens = [];
      fetchData(screens, data);
      return res.json(screens);
    });
};
const fetchData = (screens, data) => {
  data.forEach((doc) => {
    screens.push({
      screenId: doc.id,
      body: doc.data().body,
      userHandle: doc.data().userHandle,
      createdAt: doc.data().createdAt,
      commentCount: doc.data().commentCount,
      likeCount: doc.data().likeCount,
      userImage: doc.data().userImage,
      screenMedia: doc.data().screenMedia,
    });
  });
};
exports.getUserTimeline = async (req, res) => {
  let doc = await db.doc(`users/${req.user.handle}`).get();
  let myFriends = [];
  let screenData = [];
  if (doc.data().following_list) myFriends = [...doc.data().following_list];
  console.log(myFriends);
  myFriends.push(req.user.handle);
  console.log(myFriends);
  let screenList = await getScreens(myFriends);
  console.log(screenList);
  let listSize = screenList.length;
  if (screenList.length > 0) {
    screenList.forEach((screen) => {
      db.doc(`screens/${screen.screenId}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            data = {
              screenId: doc.id,
              body: doc.data().body,
              userHandle: doc.data().userHandle,
              createdAt: doc.data().createdAt,
              commentCount: doc.data().commentCount,
              likeCount: doc.data().likeCount,
              userImage: doc.data().userImage,
              screenMedia: doc.data().screenMedia,
            };
            if (doc.data().polls)
              data.polls = {
                polls: doc.data().polls,
                pollsAttributes: doc.data().pollsAttributes,
                userAllowedToRespond: validatePollsResponseAccess(
                  null,
                  null,
                  doc.data().userHandle,
                  req.user.handle,
                  myFriends
                ),
              };
            screenData.push(data);
          } else listSize--;
          if (screenData.length === listSize) return res.json(screenData);
        });
    });
  } else res.json({ message: "Not found" });
};
exports.postOneScreens = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ body: "Body must not be empty" });

  postScreen(req, res);
};
exports.postScreen = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ body: "Body must not be empty" });
  var haveValidMedia = false;
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    req.files.forEach((file) => {
      if (
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/png" &&
        file.mimetype !== "video/mp4" &&
        file.mimetype !== "audio/mpeg"
      )
        return res.status(500).json({ error: "wrong file type selected" });
      haveValidMedia = true;
    });
  }
  postScreen(req, res, haveValidMedia);
};
const convertToObject = (data) => {
  // preserve newlines, etc - use valid JSON
  data = data
    .replace(/\\n/g, "\\n")
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "\\t")
    .replace(/\\b/g, "\\b")
    .replace(/\\f/g, "\\f");
  // remove non-printable and other non-valid JSON chars
  data = data.replace(/[\u0000-\u0019]+/g, "");
  return JSON.parse(data);
};
const postScreen = async (req, res, haveValidMedia) => {
  try {
    var screenId;
    if (!req.screenMedia) req.screenMedia = null;
    const newScreen = {
      body: req.body.body,
      userHandle: req.user.handle,
      createdAt: new Date().toISOString(),
      userImage: req.user.imageUrl,
      likeCount: 0,
      commentCount: 0,
      screenMedia: req.screenMedia,
      hashtag: getHashtags(req.body.body),
    };
    console.log("received", req.body);
    let havePolls = false;
    if (req.body.hasOwnProperty("polls")) {
      newScreen.polls = handlePolls(convertToObject(req.body.polls));
      newScreen.pollsAttributes = convertToObject(req.body.pollsAttributes);
      havePolls = true;
      newScreen.pollsAttributes.pollsExpiry = convertPollsExpiryToMillis(
        newScreen.pollsAttributes.pollsExpiry
      );
    }
    console.log("newScreen", newScreen);
    try {
      let doc = await admin.firestore().collection("screens").add(newScreen);
      let resScreen = newScreen;
      screenId = doc.id;
      resScreen.screenId = doc.id;
      addScreens(resScreen);
      if (havePolls) addPollsResponse(resScreen, -1);
      if (haveValidMedia)
        resScreen.screenMedia = await handleMedia(
          req.files,
          req.user.handle,
          doc.id
        );
      if (resScreen.hasOwnProperty("polls")) {
        var tempJson = {
          polls: {
            polls: resScreen.polls,
            pollsAttributes: resScreen.pollsAttributes,
          },
        };
        delete resScreen.polls;
        delete resScreen.pollsAttributes;
        console.log("after deleting", resScreen);
        resScreen = { ...resScreen, ...tempJson };
      }
      res.json({ resScreen });
    } catch (err) {
      if (screenId)
        //TODO delete screen
        res.status(500).json({ error: `something went wrong` });
      console.error(err);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `something went wrong` });
  }
};

const handleMedia = async (files, userHandle, screenId) => {
  if (files && Array.isArray(files) && files.length > 0) {
    var screenMedia = [];
    for (const file of files) {
      const imageExtension = file.originalname.split(".")[
        file.originalname.split(".").length - 1
      ];
      const mediaName = `${file.fieldname}.${imageExtension}`;

      try {
        let url = await uploadImageToStorage(
          file,
          mediaName,
          userHandle,
          screenId
        );
        screenMedia.push(url);
      } catch (err) {
        console.log(err);
      }
    }
    screenMedia = removePreviews(screenMedia);
    await db.doc(`screens/${screenId}`).update({ screenMedia });
    return screenMedia;
  }
};
const uploadImageToStorage = (file, mediaName, userHandle, screenId) => {
  let prom = new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let folder = mediaName.includes(".mp4")
      ? "video"
      : mediaName.includes("_preview")
      ? "preview"
      : "image";
    let destination = `${userHandle}/${folder}/${mediaName}`;
    let fileUpload = admin.storage().bucket().file(destination);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        uploadFrom: `Screen ${screenId}`,
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.log(error);
      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", () => {
      const url = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${userHandle}%2f${folder}%2F${mediaName}?alt=media`;

      resolve(url);
    });
    blobStream.end(file.buffer);
  });
  return prom;

  /* 
  await admin
    .storage()
    .bucket()
    .upload(imageToBeUploaded.filepath, {
      resumable: false,
      destination: destination,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype,
          uploadFrom: "Screen ",
        },
      },
    })
    .then(() => {
      images.push(
        `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${req.user.handle}%2f${folder}%2F${imageFileName}?alt=media`
      );
      return;
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error });
    });*/
};

// const uploadImageToStorage = async (
//   req,
//   imageToBeUploaded,
//   imageFileName,
//   images,
//   res
// ) => {
//   let folder = imageFileName.includes(".mp4")
//     ? "video"
//     : imageFileName.includes("_preview")
//     ? "preview"
//     : "image";
//   let destination = `${req.user.handle}/${folder}/${imageFileName}`;
//   await admin
//     .storage()
//     .bucket()
//     .upload(imageToBeUploaded.filepath, {
//       resumable: false,
//       destination: destination,
//       metadata: {
//         metadata: {
//           contentType: imageToBeUploaded.mimetype,
//           uploadFrom: "Screen ",
//         },
//       },
//     })
//     .then(() => {
//       images.push(
//         `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${req.user.handle}%2f${folder}%2F${imageFileName}?alt=media`
//       );
//       return;
//     })
//     .catch((error) => {
//       console.error(error);
//       return res.status(500).json({ error });
//     });
// };

exports.postScreenWithImage = (req, res) => {
  try {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");
    req.body.body = req.params.message;
    const busBoy = new BusBoy({ headers: req.headers });
    let imageFileName = [];
    let imageToBeUploaded = [];

    busBoy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (
        mimetype !== "image/jpeg" &&
        mimetype !== "image/png" &&
        mimetype !== "video/mp4" &&
        mimetype !== "audio/mpeg"
      )
        return res.status(500).json({ error: "wrong file type selected" });
      console.log(fieldname);
      console.log(filename);
      console.log(mimetype);

      const imageExtension = filename.split(".")[
        filename.split(".").length - 1
      ];
      const imageName = `${fieldname}.${imageExtension}`;
      imageFileName.push(imageName);
      const filepath = path.join(os.tmpdir(), imageName);
      imageToBeUploaded.push({ filepath, mimetype });
      file.pipe(fs.createWriteStream(filepath));
    });
    images = [];
    busBoy.on("finish", () => {
      for (i = 0; i < imageFileName.length; i++) {
        uploadImageToStorage(
          req,
          imageToBeUploaded[i],
          imageFileName[i],
          images,
          res
        )
          .then(() => {
            console.log("link recieved ->", images);
            if (images.length === imageFileName.length) {
              // req.screenMedia = images;
              if (!req.body.body) req.body.body = "";
              req.screenMedia = removePreviews(images);
              postScreen(req, res);
              // res.status(501).json({ error: "Something went wrong" });
            }
            return;
          })
          .catch((err) => {
            console.log("error occurred ", err.message);
            res.status(500).json({ error: `something went wrong` });
          });
      }
    });
    busBoy.end(req.rawBody);
  } catch (err) {
    res.status(501).json({ error: "Something went wrong" });
  }
};
exports.addPollsResponse = async (req, res) => {
  var responseId = null;
  var polls;
  let ref;
  let oldResponse;
  let incrementVote = false;
  try {
    oldResponse = await db
      .collection("polls")
      .where("userHandle", "==", req.user.handle)
      .where("screenId", "==", req.params.screenId)
      .limit(1)
      .get();
    oldResponse.forEach((doc) => {
      if (doc.data().response === -1) incrementVote = true;
      responseId = doc.id;
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.code });
  }
  let doc;
  try {
    doc = await db.doc(`screens/${req.params.screenId}`).get();
    if (!doc.exists) return res.status(404).json({ error: "Screen not exist" });

    let pollsData = doc.data();
    let allowedPollsResponse;
    try {
      allowedPollsResponse = await validatePollsResponseAccess(
        db,
        pollsData,
        doc.data().userHandle,
        req.user.handle
      );
    } catch (err) {
      console.log(err);
    }
    if (!allowedPollsResponse)
      return res
        .status(403)
        .json({ error: "You are not allowed to give response in this poll" });
    if (
      pollsData.pollsAttributes &&
      pollsData.pollsAttributes.pollsExpiry >= new Date().getTime()
    ) {
      polls = pollsData.polls;
      console.log("polls", polls);
      console.log("response", req.body.response);
      polls[req.body.response].votes =
        pollsData.polls[req.body.response].votes + 1;
      // ref = doc.ref;
      if (responseId) {
        addPollsResponse(
          { screenId: req.params.screenId, userHandle: req.user.handle },
          req.body.response,
          responseId
        );
        if (!incrementVote)
          res.status(200).json({
            screenId: req.params.screenId,
            userHandle: req.user.handle,
            response: req.body.response,
          });
        else {
          doc.ref.update({ polls: polls }).then((doc) => {
            res.status(200).json({
              screenId: req.params.screenId,
              userHandle: req.user.handle,
              response: req.body.response,
            });
          });
        }
      } else {
        doc.ref
          .update({ polls: polls })
          .then((doc) => {
            res.status(200).json({
              screenId: req.params.screenId,
              userHandle: req.user.handle,
              response: req.body.response,
            });
            addPollsResponse(
              { screenId: req.params.screenId, userHandle: req.user.handle },
              req.body.response,
              responseId
            );
            // return;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else return res.status({ message: "Poll expired" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.code });
  }

  // db.doc(`screens/${req.params.screenId}`)
  //   .get()
  //   .then((doc) => {
  //     if (!doc.exists)
  //       return res.status(404).json({ error: "Screen not exist" });
  //     let pollsData = doc.data();
  //     if (!pollsData.pollsAttributes.pollsType == "everyOne")
  //       if (
  //         pollsData.pollsAttributes &&
  //         pollsData.pollsAttributes.pollsExpiry >= new Date().getTime()
  //       ) {
  //         polls = pollsData.data().polls;
  //         polls[req.body.response].votes =
  //           pollsData.data().polls[req.body.response].votes + 1;
  //         ref = pollsData.ref;
  //         if (responseId) return;
  //         else return ref.update({ polls: polls });
  //       } else res.status({ message: "Poll expired" });
  //   })

  //   .then(() => {
  //     return addPollsResponse(
  //       { screenId: req.params.screenId, userHandle: req.user.handle },
  //       req.body.response,
  //       responseId
  //     );
  //   })
  //   .then(() => {
  //     return res
  //       .status(200)
  //       .json({ screenId: req.params.screenId, userHandle: req.user.handle });
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     return res.status(500).json({ error: "Something went wrong" });
  //   });
};
const addPollsResponse = async (data, response, responseId) => {
  var store = {
    screenId: data.screenId,
    userHandle: data.userHandle,
    response: response,
  };
  if (responseId)
    await db
      .doc(`/polls/${responseId}`)
      .update("response", response)
      .then((doc) => {
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  else
    await admin
      .firestore()
      .collection("polls")
      .add(store)
      .then((res) => {
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
};
const convertPollsExpiryToMillis = (expiryArray) => {
  const millsRecord = [86400000, 3600000, 60000];
  var millis = 0;
  expiryArray.map((item, index) => (millis += millsRecord[index] * item));
  return millis + new Date().getTime();
};
const handlePolls = (polls) => {
  let pollArray = [];
  polls.map((item) => pollArray.push({ body: item, votes: 0 }));
  return pollArray;
};
//info for a screen
exports.getScreens = async (req, res) => {
  let screenData = {};
  let screenDoc = await db.doc(`/screens/${req.params.screenId}`).get();
  if (!screenDoc.exists) {
    return res.status(404).json({ error: "Screens not found" });
  }
  screenData = screenDoc.data();
  screenData.screenId = screenDoc.id;
  let userAllowedToRespond = false;
  userHandle = req.user ? req.user.handle : null;
  try {
    if (screenData.polls)
      screenData.polls = {
        polls: screenData.polls,
        pollsAttributes: screenData.pollsAttributes,
        userAllowedToRespond: await validatePollsResponseAccess(
          db,
          screenData,
          screenData.userHandle,
          userHandle
        ),
      };
    // userAllowedToRespond = await validatePollsResponseAccess(
    //   db,
    //   screenData,
    //   screenData.userHandle,
    //   userHandle
    // );
  } catch (err) {
    console.log(err);
    return res.status(501).json({ error: "Error occurred" });
  }
  db.collection("comments")
    .where("screenId", "==", req.params.screenId)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      screenData.comments = [];
      data.forEach((doc) => {
        screenData.comments.push(doc.data());
      });
      return db
        .collection("polls")
        .where("screenId", "==", req.params.screenId)
        .get();
    })
    .then((data) => {
      screenData.pollsResponse = [];
      data.forEach((doc) => {
        screenData.pollsResponse.push(doc.data());
      });
      return res.json(screenData);
    });

  /*db.doc(`/screens/${req.params.screenId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Screens not found" });
      }
      screenData = doc.data();
      screenData.screenId = doc.id;
      return db.collection('polls').where('screenId','==',doc.id);
    }).then((data) => {
      screenData.polls = [];
      data.forEach((doc) => {
        screenData.polls.push(doc.data());
      });
     return db
      .collection("comments")
      .where("screenId", "==", req.params.screenId)
      .orderBy("createdAt", "desc")
      .get();
    })
    .then((data) => {
      screenData.comments = [];
      data.forEach((doc) => {
        screenData.comments.push(doc.data());
      });
      return res.json(screenData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
  */
};

//comment on a screen
exports.commentOnScreen = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screenId: req.params.screenId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };
  db.doc(`screens/${req.params.screenId}`)
    .get()
    .then((doc) => {
      if (!doc.exists)
        return res.status(404).json({ error: "Screen not exist" });
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      return res.status(200).json(newComment);
    })
    .catch((err) => {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

exports.likeScreen = async (req, res) => {
  console.log("screenid", req.params.screenId);
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screenId", "==", req.params.screenId)
    .limit(1);
  const screenDocument = db.doc(`/screens/${req.params.screenId}`);
  let screenData;
  let doc = await screenDocument.get();
  if (!doc.exists) return res.status(404).json({ error: "Screen not found" });
  screenData = doc.data();
  screenData.screenId = doc.id;
  console.log({ screenData });

  try {
    if (screenData.hasOwnProperty("polls")) {
      const userAllowedToRespond = await validatePollsResponseAccess(
        db,
        screenData,
        screenData.userHandle,
        req.user.handle
      );
      screenData.polls = {
        polls: screenData.polls,
        pollsAttributes: screenData.pollsAttributes,
        userAllowedToRespond: userAllowedToRespond,
      };
    } else console.log("not have polls");
  } catch (err) {
    console.log(err);
    return res.status(501).json({ error: "Error occurred" });
  }

  likeDocument
    .get()
    .then((data) => {
      //not have any like
      if (data.empty)
        return db
          .collection("likes")
          .add({
            screenId: req.params.screenId,
            userHandle: req.user.handle,
          })
          .then(() => {
            screenData.likeCount++;
            return screenDocument.update({ likeCount: screenData.likeCount });
          })
          .then(() => {
            return res.json(screenData);
          });
      else {
        return res.status(400).json({ error: "Screen already liked" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error.code });
    });
  /*  screenDocument
    .get()
    .then((doc) => {
      if (doc.exists === true) {
        screenData = doc.data();
        screenData.screenId = doc.id;
        return likeDocument.get();
      } else {
        res.status(404).json({ error: "Screen not found" });
      }
    })
    .then((data) => {
      //not have any like
      if (data.empty)
        return db
          .collection("likes")
          .add({
            screenId: req.params.screenId,
            userHandle: req.user.handle,
          })
          .then(() => {
            screenData.likeCount++;
            return screenDocument.update({ likeCount: screenData.likeCount });
          })
          .then(() => {
            return res.json(screenData);
          });
      else {
        return res.status(400).json({ error: "Screen already liked" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error.code });
    });*/
};
exports.unlikeScreen = async (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screenId", "==", req.params.screenId)
    .limit(1);
  const screenDocument = db.doc(`/screens/${req.params.screenId}`);
  const doc = await screenDocument.get();
  if (!doc.exists) return res.status(404).json({ error: "Screen not found" });
  screenData = doc.data();
  screenData.screenId = doc.id;
  console.log({ screenData });
  try {
    if (screenData.hasOwnProperty("polls")) {
      const userAllowedToRespond = await validatePollsResponseAccess(
        db,
        screenData,
        screenData.userHandle,
        req.user.handle
      );
      screenData.polls = {
        polls: screenData.polls,
        pollsAttributes: screenData.pollsAttributes,
        userAllowedToRespond: userAllowedToRespond,
      };
    } else console.log("not have polls");
  } catch (err) {
    console.log(err);
    return res.status(501).json({ error: "Error occurred" });
  }
  likeDocument
    .get()
    .then((data) => {
      //not have any like
      if (data.empty)
        return res.status(400).json({ error: "Screen not liked" });
      else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screenData.likeCount--;
            return screenDocument.update({ likeCount: screenData.likeCount });
          })
          .then(() => {
            return res.json(screenData);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error.code });
    });
  /*const screenDocument = db.doc(`/screens/${req.params.screenId}`);
  let screenData;
  screenDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screenData = doc.data();
        screenData.screenId = doc.id;
        return likeDocument.get();
      } else {
        res.status(404).json({ error: "Screen not found" });
      }
    })
    .then((data) => {
      //not have any like
      if (data.empty)
        return res.status(400).json({ error: "Screen not liked" });
      else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screenData.likeCount--;
            return screenDocument.update({ likeCount: screenData.likeCount });
          })
          .then(() => {
            return res.json(screenData);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error.code });
    });*/
};

exports.deleteScreen = (req, res) => {
  const document = db.doc(`/screens/${req.params.screenId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists)
        return res.status(404).json({ error: "Screen not found" });
      else {
        if (doc.data().userHandle !== req.user.handle)
          return res.status(403).json({ error: "Unauthorized" });
        else {
          return document.delete();
        }
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .then(() => {
      deleteScreen(req.params.screenId);
      res.json({ message: "Screen deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};
exports.getUserMedia = async (req, res) => {
  const { Storage } = require("@google-cloud/storage");
  const options = {
    prefix: `${req.params.handle}/${req.params.type}/`,
  };

  options.delimiter = "/";
  const storage = new Storage();
  const url = `https://firebasestorage.googleapis.com/v0/b/letssocially.appspot.com/o/${req.params.handle}%2F${req.params.type}%2F-filename-?alt=media`;
  res.json(await getFiles(options, storage, url, req.params.handle));
  // await getFiles(options, storage);
};
async function getFiles(options, storage, url, userHandle) {
  var media = [];
  const [files] = await storage
    .bucket("letssocially.appspot.com")
    .getFiles(options);
  console.log("Files:");
  files.forEach((file) => {
    let fileName = file.name.replace(options.prefix, "");
    console.log(fileName, "metadata", file.metadata);
    try {
      if (fileName.trim() !== "") {
        media.push({
          imageUrl: url.replace("-filename-", fileName),
          uploadFrom:
            file.metadata.metadata &&
            file.metadata.metadata.hasOwnProperty("uploadFrom")
              ? file.metadata.metadata.uploadFrom
              : "Not available",
          uploadDate: file.metadata.timeCreated,
          fileName,
          userHandle,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
  return media;
}
exports.getUserActivityScreens = (req, res) => {
  let activity = [];
  console.log("type", req.params.type, "handle", req.params.handle);
  let activityIds = [];
  db.collection(req.params.type)
    .where("userHandle", "==", req.params.handle)
    .get()
    .then((snap) => {
      let size = snap.size;
      console.log("size", snap.size);
      if (size === 0) return res.status(200).json(activity);
      snap.forEach((doc) => {
        db.doc(`screens/${doc.data().screenId}`)
          .get()
          .then((doc) => {
            if (doc.exists && !activityIds.includes(doc.id)) {
              let store = { screenId: doc.id, ...doc.data() };
              if (doc.data().polls) {
                store.polls = {};
                store.polls = {
                  polls: doc.data().polls,
                  pollsAttributes: doc.data().pollsAttributes,
                  userAllowedToRespond: "check",
                };
                delete store["pollsAttributes"];
              }
              activity.push(store);
            } else size--;
            activityIds.push(doc.id);
            if (size === activity.length) res.json(activity);
          });
      });
    });
};
exports.getScreenVoters = async (req, res) => {
  try {
    if (!req.params.screenId || req.param.screenId === "") {
      res.status(503).json({ error: "Invalid screenId" });
    }
    let snap = await db
      .collection("polls")
      .where("screenId", "==", req.params.screenId)
      .get();
    pollsRecord = [];
    snap.forEach((doc) => {
      pollsRecord.push({ ...doc.data() });
    });
    if (pollsRecord.length == 0)
      return res.status(503).json({ error: "Invalid screenId" });

    for (var i = 0; i < pollsRecord.length; i++) {
      let doc = await db.doc(`/users/${pollsRecord[i].userHandle}`).get();
      pollsRecord[i]["userImage"] = doc.data().imageUrl;
      pollsRecord[i]["username"] = doc.data().username;
    }
    res.json(pollsRecord);
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: "An error occurred" });
  }
};

exports.getScreenLikedUser = async (req, res) => {
  try {
    if (!req.params.screenId || req.param.screenId === "") {
      res.status(503).json({ error: "Invalid screenId" });
    }
    let snap = await db
      .collection("likes")
      .where("screenId", "==", req.params.screenId)
      .get();
    pollsRecord = [];
    snap.forEach((doc) => {
      pollsRecord.push({ ...doc.data() });
    });
    if (pollsRecord.length == 0)
      return res.status(503).json({ error: "Invalid screenId" });

    for (var i = 0; i < pollsRecord.length; i++) {
      let doc = await db.doc(`/users/${pollsRecord[i].userHandle}`).get();
      pollsRecord[i]["userImage"] = doc.data().imageUrl;
      pollsRecord[i]["username"] = doc.data().username;
    }
    res.json(pollsRecord);
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: "An error occurred" });
  }
};
