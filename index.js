// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://realtime-database-30a13-default-rtdb.firebaseio.com/",
};

let endorseObj = {
  to: "Eyoel",
  from: "Asfaw",
  like: 0,
  content: "You sound like shut up we doing this once text",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsmentInDB = ref(database, "endorsment");

const publishEl = document.querySelector("#publish-el");
const fromEl = document.querySelector("#from-el");
const toEl = document.querySelector("#to-el");
const endorseEl = document.querySelector("#endorse-el");
const endorseDiv = document.querySelector("#endorsments");

let unLike = false;

onValue(endorsmentInDB, function (snapshot) {
  if (snapshot.exists()) {
    let endorsmentArray = Object.entries(snapshot.val());
    endorsmentArray.reverse();

    clearEndorsments();

    for (let i = 0; i < endorsmentArray.length; i++) {
      let currEndorsment = endorsmentArray[i];

      appendItemtoEndorseDiv(currEndorsment);
    }
  } else {
    endorseDiv.innerHTML = "No Endorsments to display";
  }
});

publishEl.addEventListener("click", function () {
  let fromValue = fromEl.value;
  let toValue = toEl.value;
  let endorseValue = endorseEl.value;

  setEndorseObj(endorseValue, fromValue, toValue);

  clearInputFields();

  push(endorsmentInDB, endorseObj);
});

function clearInputFields() {
  fromEl.value = "";
  toEl.value = "";
  endorseEl.value = "";
}

function setEndorseObj(endorseValue, fromValue, toValue) {
  endorseObj.content = endorseValue;
  endorseObj.from = fromValue;
  endorseObj.to = toValue;
}

function clearEndorsments() {
  endorseDiv.innerHTML = "";
}

function appendItemtoEndorseDiv(endorsment) {
  let endorsmentID = endorsment[0];
  let endorsmentValue = endorsment[1];

  let to_el = document.createElement("h4");
  let from_el = document.createElement("h4");
  let content_el = document.createElement("p");
  let like_el = document.createElement("h4");
  let from_like = document.createElement("div");
  let endorsmentEl = document.createElement("div");

  endorsmentEl.classList.add("endorsment");
  from_like.classList.add("from-like");
  like_el.classList.add("like-el");
  content_el.classList.add("endorsment-txt");
  from_el.classList.add("from-txt");
  to_el.classList.add("to-txt");

  to_el.textContent = `To ${endorsmentValue.to}`;
  from_el.textContent = `From ${endorsmentValue.from}`;
  content_el.textContent = endorsmentValue.content;
  like_el.innerHTML = `<span>&#10084;</span> ${endorsmentValue.like}`;

  like_el.addEventListener("click", function () {
    let likeNum = endorsmentValue.like;
    if (!unLike) {
      likeNum += 1;
      unLike = true;
    } else {
      likeNum -= 1;
      unLike = false;
    }
    let exactLikeLocationInDB = ref(
      database,
      `endorsment/${endorsmentID}/like`
    );
    set(exactLikeLocationInDB, likeNum);
  });

  from_like.append(from_el);
  from_like.append(like_el);

  endorsmentEl.append(to_el);
  endorsmentEl.append(content_el);
  endorsmentEl.append(from_like);

  endorseDiv.append(endorsmentEl);

  //   <div class="endorsment">
  //           <h4 class="to-txt">To Leanne</h4>
  //           <p class="endorsment-txt">
  //             Leanne! Thank you so much for helping me with the March accounting.
  //             Saved so much time because of you! 💜 Frode
  //           </p>
  //           <div class="from-like">
  //             <h4 class="from-txt">From Frode</h4>
  //             <h4 class="like-el">❤️ 4</h4>
  //           </div>
  //     </div>
}
