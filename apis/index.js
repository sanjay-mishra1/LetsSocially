const functions = require("firebase-functions");
const FBAuth = require("./util/fbAuth");
const express = require("express");
const cors = require("cors");
const { fileParser } = require("express-multipart-file-parser");
const app = express();
// app.use(
//   fileParser({
//     rawBodyOptions: {
//       limit: "15mb", //file size limit
//     },
//     busboyOptions: {
//       limits: {
//         fields: 20, //Number of text fields allowed
//       },
//     },
//   })
// );
// app.use(cors());
app.use(require("./util/middleware"));
const { db } = require("./util/admin");
const {
  postOneScreens,
  getScreens,
  getAllScreens,
  commentOnScreen,
  likeScreen,
  unlikeScreen,
  deleteScreen,
  postScreenWithImage,
  getUserTimeline,
  getUserMedia,
  getUserActivityScreens,
  addPollsResponse,
  getScreenVoters,
  getScreenLikedUser,
  postScreen,
} = require("./handlers/screens");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetail,
  markNotificationRead,
  getSearchResult,
  getTrandingNews,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  uploadTempImage,
  getFollowSuggestions,
  test,
} = require("./handlers/users");

//for testing
app.post("/image-test/:handle", uploadTempImage);

//user route
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.post("/user/image", FBAuth, uploadImage);
app.post("/signup", signup);
app.post("/login", login);
//get other user detail
app.get("/user/:handle/:currentHandle", getUserDetail);
app.post("/notifications", FBAuth, markNotificationRead);
app.get("/user/suggestions", FBAuth, getFollowSuggestions);
app.get("/user/media/:handle/:type", getUserMedia);
app.get("/user/activity/:handle/:type", getUserActivityScreens);
app.get("/test", test);
//follow requests
app.post("/follow/:handle", FBAuth, followUser);
app.post("/unfollow/:handle", FBAuth, unfollowUser);
app.get("/followers/:handle", FBAuth, getFollowers);
app.get("/following/:handle", FBAuth, getFollowing);

//screen route
app.get("/screens", FBAuth, getUserTimeline);
// app.get("/screens", getScreens);
app.post("/screen", FBAuth, postScreen);
// app.post("/screens", FBAuth, postOneScreens);
// app.post("/screens/new/", FBAuth, postScreenWithImage);
// app.post("/screens/new/:message", FBAuth, postScreenWithImage);
//screen media route

app.get("/screens/:screenId", getScreens);
app.delete("/screens/:screenId", FBAuth, deleteScreen);
// TODO like screen
app.get("/screens/:screenId/like", FBAuth, likeScreen);
// TODO unlike screen
app.get("/screens/:screenId/unlike", FBAuth, unlikeScreen);
app.post("/screens/:screenId/comments", FBAuth, commentOnScreen);
app.get("/votes/:screenId", FBAuth, getScreenVoters);
app.get("/likes/:screenId", FBAuth, getScreenLikedUser);
//polls
app.post("/screens/:screenId/addPollResponse", FBAuth, addPollsResponse);
//search
app.post("/search/:query", getSearchResult);
//news
app.get("/news/:topic", getTrandingNews);

//https://baseurl.com/api
exports.api = functions.region("asia-south1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("asia-south1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screens/${snapshot.data().screenId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle)
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screenId: doc.id,
          });
      })

      .catch((error) => {
        console.error(error);
      });
  });
exports.createNotificationOnComment = functions
  .region("asia-south1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screens/${snapshot.data().screenId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle)
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screenId: doc.id,
          });
      })

      .catch((error) => {
        console.error(error);
      });
  });

exports.deleteNotificationOnUnlike = functions
  .region("asia-south1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()

      .catch((error) => {
        console.error(error);
      });
  });
exports.onUserImageChange = functions
  .region("asia-south1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    console.log("Before", change.before.data());
    console.log("After", change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has change");
      const batch = db.batch();
      return db
        .collection("screens")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const screen = db.doc(`/screens/${doc.id}`);
            batch.update(screen, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onScreenDelete = functions
  .region("asia-south1")
  .firestore.document("/screens/{screenId}")
  .onDelete((snapshot, context) => {
    const screenId = context.params.screenId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screenId", "==", screenId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("screenId", "==", screenId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db.collection("polls").where("screenId", "==", screenId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/polls/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screenId", "==", screenId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });
