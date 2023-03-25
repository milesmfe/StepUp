const readline = require("readline");
const chalk = require("chalk");
const firebase = require("firebase/compat/app");
const { getDatabase, ref, set, push } = require("firebase/database");

const app = firebase.initializeApp({
  apiKey: "AIzaSyCvyVXFXao3qiAcByrZQzbg05ZcjaQEq7o",
  authDomain: "stepup-sustainable.firebaseapp.com",
  projectId: "stepup-sustainable",
  storageBucket: "stepup-sustainable.appspot.com",
  messagingSenderId: "510410214302",
  appId: "1:510410214302:web:448342900c5eebd6dfe48f",
  measurementId: "G-YYRC390X6D",
  databaseURL:
    "https://stepup-sustainable-default-rtdb.europe-west1.firebasedatabase.app/",
  credential: "~/stepup-sustainable-firebase-adminsdk-k2s7q-1150bab0e0.json",
});

const db = getDatabase(app);

const flowerCardReferenceSchema = (data = {}) => ({
  sectionId: data?.sectionId || "",
  flowerCardId: data?.flowerCardId || "",
});

const flowerCardDataSchema = (data = {}) => ({
  ...flowerCardReferenceSchema(data),
  title: data?.title || "Unnamed Flower",
  description: data?.description || "",
  photoURL: data?.photoURL || "/",
  reward: data?.reward || 0,
  validated: data?.validated || false,
  activity: {
    type: data?.activity?.type || "",
    params: data?.activity?.params || "",
  },
});

function writeNewFlowerCard(sectionId, data) {
  // ensure function recieved data
  if (!data) return false;
  // reference the flower cards section in the database
  const flowerCardRef = ref(db, `flowerCards/${sectionId}`);
  // create a flower card in database, based on the data in parameter
  const pushFlowerCardRef = push(flowerCardRef);
  set(pushFlowerCardRef, flowerCardDataSchema(data));
}

console.log(
  chalk.green(
    `
 __  _                             
/ _\\| |_  ___  _ __   /\\ /\\  _ __  
\\ \\ | __|/ _ \\| '_ \\ / / \\ \\| '_ \\ 
_\\ \\| |_|  __/| |_) |\\ \\_/ /| |_) |
\\__/ \\__|\\___|| .__/  \\___/ | .__/ 
              |_|           |_|
`
  )
);

function askQuestion(query, options) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query + chalk.yellow(` ${options} `), (ans) => {
      rl.close();
      resolve(ans);
      console.log(chalk.blue(ans));
    })
  );
}

async function main() {
  let flag = true;
  while (flag) {
    const ans = await askQuestion("Write a new flower card?", "[y/n]");
    if (ans === "y") {
      const sectionId = await askQuestion("Which section?", "[string]");
      const title = await askQuestion("Give the title:", "[string]");
      const description = await askQuestion(
        "Give the description:",
        "[string]"
      );
      const photoURL = await askQuestion("Give the photo url:", "[string]");
      const reward = await askQuestion("Give the point reward value:", "[int]");
      const validated = await askQuestion("Is this validated?", "[true/false]");
      const activity = {
        type: "strava",
        params: {
          sport: await askQuestion("Give the sport type:", "[eg Walk]"),
          distance: await askQuestion("Give the required distance:", "[int]"),
        },
      };
      writeNewFlowerCard(sectionId, {
        title: title,
        description: description,
        photoURL: photoURL,
        reward: reward,
        validated: validated,
        activity: activity,
      });
      console.log(chalk.greenBright("Done!\n"));
    } else flag = false;
  }
  process.exit();
}

main();
