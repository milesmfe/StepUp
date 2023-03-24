// imports
import {
  get,
  getDatabase,
  increment,
  push,
  ref,
  set,
  remove,
} from "firebase/database";

import app from "./firebase";

// set db variable to lead to firebase database
const db = getDatabase(app);
const date = new Date(); //in order to get time of post creation
let currentDate = date.toJSON();

// Schemas Garden -------------------------------------------------------- //

/**
 * A dictionary used to reference a specific flower card
 * @param {*} data
 * @returns
 */
const flowerCardReferenceSchema = (data = {}) => ({
  sectionId: data?.sectionId || "",
  flowerCardId: data?.flowerCardId || "",
});

/**
 * A dictionary containing data about a flower card
 * @param {*} data
 * @returns
 */
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

/**
 * A dictionary containing data about a flower
 * @param {*} data
 * @returns
 */
const flowerSchema = (data = {}) => ({
  ...flowerCardReferenceSchema(data),
  progress: data?.progress || 0,
  position: {
    x: data?.position?.x || 0,
    y: data?.position?.y || 0,
  },
});

/**
 * A dictionary containing the packed garden data
 * @param {*} data
 * @returns
 */
export const packedGardenSchema = (data = {}) => ({
  points: data?.points || 0,
  streak: data?.streak || 0,
  level: data?.level || 0,
  seeds:
    data?.seeds && Array.isArray(data.seeds)
      ? data?.seeds.map(flowerCardReferenceSchema)
      : data?.seeds
      ? Object.values(data.seeds).map((k) => k)
      : [],
  planted:
    data?.planted && Array.isArray(data.planted)
      ? data?.planted.map(flowerSchema)
      : data?.planted
      ? Object.values(data.planted).map((k) => k)
      : [],
  gardenSize: {
    width: data?.gardenSize?.width || 5,
    height: data?.gardenSize?.height || 5,
  },
});

/**
 * A structure containing the unpacked garden data
 * @param {*} data
 * @returns
 */
export const unpackedGardenSchema = async (data = {}) => {
  const { seeds, planted, ...rest } = packedGardenSchema(data);
  return {
    ...rest,
    seeds: await Promise.all(
      seeds && Array.isArray(seeds) ? seeds.map(loadSeed) : []
    ),
    planted: await Promise.all(
      planted && Array.isArray(planted) ? planted.map(loadPlant) : []
    ),
  };
};

/**
 * Attempt to load a seed
 * @param {*} data
 * @returns
 */
const loadSeed = async (data) => {
  // unpack input
  const { sectionId, flowerCardId } = data;
  // try to read this seed's data from the database
  const lookup = await readFlowerCardData(sectionId, flowerCardId);
  // if successful read
  if (lookup)
    // return the formatted flower card data
    return flowerCardDataSchema({ ...lookup, sectionId, flowerCardId });
  // if unsuccessful read, just return the input
  else return data;
};

/**
 * Attempt to load a flower
 * @param {*} data
 * @returns
 */
const loadPlant = async (data) => {
  // unpack input
  const { sectionId, flowerCardId } = data;
  // try to read this flower card from the database
  const lookup = await readFlowerCardData(sectionId, flowerCardId);
  // upon successful read
  if (lookup)
    // return the formatted flower card data
    return {
      ...flowerCardDataSchema({ ...lookup, sectionId, flowerCardId }),
      ...data,
    };
  // if unsuccessful read, just return the input
  else return data;
};

// Read Queries: Garden -------------------------------------------------- //

/**
 * Read a user's garden data from the database
 * @param {String} userId
 * @returns
 */
export async function readGardenData(userId) {
  // reference this user's garden in the database
  const gardenRef = ref(db, `users/${userId}/garden`);
  // retrieve their garden data
  const snapshot = await get(gardenRef);
  // return the data, or null if not applicable
  return snapshot.val() || null;
}

/**
 * Read a user's garden data from the database
 * and return with a specified format
 * @param {String} userId
 * @param {Boolean} unpack
 * @returns
 */
export async function readFormattedGardenData(userId, unpack = false) {
  // try to retrieve this user's garden data
  const gardenData = await readGardenData(userId);
  // return the data, either packed or unpacked, determined by parameter
  return unpack
    ? unpackedGardenSchema(gardenData)
    : packedGardenSchema(gardenData);
}

/**
 * Read a flower card's data from the database
 * @param {*} sectionId
 * @returns
 */
export async function readFlowerCardData(
  sectionId = "",
  flowerCardId = "default"
) {
  // reference this flower card in the database
  const flowerCardRef = ref(db, `flowerCards/${sectionId}/${flowerCardId}`);
  // retrieve the data
  const snapshot = await get(flowerCardRef);
  // return the data, or null if not applicable
  return snapshot.val() || null;
}

/**
 * Read a data for a list of flower cards from the database
 * @param {String} sectionId
 * @returns
 */
export async function readFlowerCardListData(sectionId) {
  // reference a set of flower cards in the database
  const flowerCardListRef = ref(db, `flowerCards/${sectionId}`);
  const snapshot = await get(flowerCardListRef);
  // attempt to create a list of these flower cards
  const flowerCardList = snapshot.val()
    ? Object.keys(snapshot.val()).map((k) =>
        flowerCardReferenceSchema({
          sectionId: sectionId,
          flowerCardId: k,
        })
      )
    : null;
  // Ensure a list was read and not an object by filtering
  if (flowerCardList)
    return flowerCardList.filter((k) => k.flowerCardId[0] === "-");
  else return false;
}

// Write Queries: Garden ------------------------------------------------- //

/**
 * Write the information about a user's garden to the database
 * @param {String} userId
 * @param {*} data
 */
export function writeGardenData(userId, data) {
  // reference this user's garden in the database
  const gardenRef = ref(db, `users/${userId}/garden/`);
  // update their garden data in the database
  const gardenData = packedGardenSchema(data);
  set(gardenRef, gardenData);
}

/**
 * create a new flower card in the database
 * @param {String} sectionId
 * @param {*} data
 * @returns
 */
export function writeNewFlowerCard(sectionId, data) {
  // ensure function recieved data
  if (!data) return false;
  // reference the flower cards section in the database
  const flowerCardRef = ref(db, `flowerCards/${sectionId}`);
  // create a flower card in database, based on the data in parameter
  const pushFlowerCardRef = push(flowerCardRef);
  set(pushFlowerCardRef, flowerCardDataSchema(data));
}

/**
 * Increase the number of points a user has
 * @param {String} userId
 * @param {Number} by
 * @returns
 */
export function incrementUserPoints(userId, by) {
  // check we are increasing by non-zero amount
  if (isNaN(by)) return;
  // add the increment to this user's points
  const pointsRef = ref(db, `users/${userId}/garden/points`);
  set(pointsRef, increment(by));
}

// List Push Queries: Garden --------------------------------------------- //

/**
 * Give the user a new seed to plant
 * @param {String} userId
 * @param {String} sectionId
 * @param {String} flowerCardId
 * @returns
 */
export async function giveUserFlowerCard(userId, sectionId, flowerCardId) {
  // Check a flower card Id was provided
  if (!flowerCardId) return false;
  // Check flowerCard exists
  const lookup = await readFlowerCardData(sectionId, flowerCardId);
  // if not, return false
  if (!lookup) return false;
  // if it does exist, add it to the user's collection of seeds
  const seedsRef = ref(db, `users/${userId}/garden/seeds`);
  const pushSeedsRef = push(seedsRef);
  set(pushSeedsRef, flowerCardReferenceSchema({ sectionId, flowerCardId }));
}

/**
 * Give the user new seeds to plant
 * @param {String} userId
 * @param {String} sectionId
 * @param {String} flowerCardId
 * @returns
 */
export async function giveUserFlowerCardList(userId, sectionId) {
  // Check a section Id was provided
  if (!sectionId) return false;
  // Check this flowerCardList exists
  const lookup = await readFlowerCardListData(sectionId);
  // if not, return false
  if (!lookup) return false;
  // if it does exist, add the seeds the user's collection of seeds
  const seedsRef = ref(db, `users/${userId}/garden/seeds`);
  lookup.forEach((flowerCard) => {
    let pushRef = push(seedsRef);
    set(pushRef, flowerCard);
  });
  return true;
}

// List Delete Queries: Garden -------------------------------------------- //

/**
 * Remove a certain seed from a given user
 * @param {String} userId
 * @param {String} sectionId
 * @param {String} flowerCardId
 * @returns
 */
export async function removeUserFlowerCard(userId, sectionId, flowerCardId) {
  // reference data stored about this user's seeds in the database
  const seedsRef = ref(db, `users/${userId}/garden/seeds`);
  // retrieve this data to a list
  const snapshot = await get(seedsRef);
  const flowerCardList = snapshot.val();
  // if this list is empty, return false
  if (!flowerCardList) return false;
  // attempt to find the seed we are trying to remove
  const deleteId = Object.keys(snapshot.val()).find(
    (k) => flowerCardList[k].flowerCardId === flowerCardId
  );
  // if the user did not have this seed, return false
  if (!deleteId) return false;
  // otherwise, reference this seed in the database
  const deleteSeedRef = ref(db, `users/${userId}/garden/seeds/${deleteId}`);
  // and update its value to null, removing it
  set(deleteSeedRef, null);
}

// Schemas: User --------------------------------------------------------- //

const activitySchema = (data = {}) => ({
  title: data?.title || "",
  time: data?.time || currentDate,
});

const emissionsSchema = (data = {}) => ({
  value: data?.value || 0,
  time: data?.time || currentDate,
});

/**
 * A dictionary in the format required
 * for a database write of profile data
 */
const profileSchema = (data = {}) => ({
  firstName: data?.firstName || "",
  lastName: data?.lastName || "",
  username: data?.username || "",
  photoURL: data?.photoURL || "/",
  posts: data?.posts || [],
  activity:
    data?.activity && Array.isArray(data.activity)
      ? data?.activity.map(activitySchema)
      : data?.activity
      ? Object.values(data.activity).map((k) => k)
      : [],
  emissions:
    data?.emissions && Array.isArray(data.emissions)
      ? data?.emissions.map(emissionsSchema)
      : data?.emissions
      ? Object.values(data.emissions).map((k) => k)
      : [],
  visible: true,
});

/**
 * A dictionary in the format required for
 * a database write of all of a given user's data
 */
const userSchema = (data = {}) => ({
  // set the profile data using correct schema
  profile: profileSchema(data?.profile),
  // set garden data using correct schema
  garden: packedGardenSchema(data?.garden),
  // TODO: Add more user data if needed
});

// Read Queries: User --------------------------------------------------- //

/**
 * Read all the data stored about a given user in the database
 * @param {String} userId
 * @returns
 */
export async function readUserData(userId) {
  // reference this user's data in the database
  const userRef = ref(db, `users/${userId}`);
  // attempt to retrieve this data
  const snapshot = await get(userRef);
  // return the data, or null if not applicable
  return snapshot.val() || null;
}

/**
 * Read the profile data from the database for a given user
 * @param {String} userId
 * @returns
 */
export async function readProfileData(userId) {
  // reference this user's profile in the database
  const profileRef = ref(db, `users/${userId}/profile/`);
  // attempt to retrieve this profile data
  const snapshot = await get(profileRef);
  // return the data, or null if not applicable
  return profileSchema(snapshot.val()) || null;
}

/**
 *  Read all the data about all users in the database
 */
// Caution: this reads ALL user data
export async function readUsers() {
  // connect to the users table in the database
  const usersRef = ref(db, "users");
  // retrieve the data
  const snapshot = await get(usersRef);
  // return the data, or null if not applicable
  return snapshot.val() || null;
}

export async function readUserPost(userID) {
  const userRef = ref(db, "users/" + userID + "/posts");
  const snapshot = await get(userRef);
  return snapshot.val();
}

// Write Queries: User -------------------------------------------------- //

/**
 * Write the user's details to the database  upon account creation
 * @param {String} uid
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} username
 * @param {String} photoURL
 */
export function writeUserCreationDetails(
  uid,
  firstName,
  lastName,
  username,
  photoURL
) {
  // set up a dictionary of profile data containing the inputs
  const profile = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    photoURL: photoURL,
  };
  // log this event to the console
  console.log(userSchema({ profile: profile }));
  // create a record for this user in the users table of the database
  const newUserRef = ref(db, `users/${uid}`);
  // update their data to reflect the details they provided
  set(newUserRef, userSchema({ profile: profile }));
}

/**
 * Write data regarding a user's profile to the database
 * @param {String} userId
 * @param {*} data
 */
export async function writeProfileDetails(userId, data) {
  // read the user's data from the database
  const current = await readProfileData(userId);
  const updated = profileSchema({ ...current, ...data });
  // reference the profile section of the user's data
  const profileRef = ref(db, `users/${userId}/profile`);
  // update their profile data to reflect the change
  set(profileRef, updated);
}

export function writeUserPost(userID, postContent) {
  const postListRef = ref(db, "users/" + userID + "/posts");
  const newPostRef = push(postListRef);
  set(newPostRef, {
    post: postContent,
    date: currentDate,
  });
}

// Writes user emissions as a list (replace existing data)
export function writeUserEmissions(userID, emissions) {
  const profileRef = ref(db, `users/${userID}/profile/emissions`);
  if (Array.isArray(emissions)) {
    emissions = emissions.map((data) => {
      return emissionsSchema(data);
    });
    set(profileRef, emissions);
    return true;
  }
  return false;
}

// Writes user activity as a list (replace existing data)
export function writeUserActivity(userID, activity) {
  const activitiesRef = ref(db, `users/${userID}/profile/activity`);
  if (Array.isArray(activity)) {
    activity = activity.map((data) => {
      return activitySchema(data);
    });
    set(activitiesRef, activity);
    return true;
  }
  return false;
}

export async function addUserActivity(userId, activity) {
  if (!activity) return false;
  const activityRef = ref(db, `users/${userId}/profile/activity`);
  const pushActivityRef = push(activityRef);
  set(
    pushActivityRef,
    activitySchema({ time: activity.time, title: activity.title })
  );
}

// Delete Queries---------------------------------------------------------/

export function deletePost(userID, contentID) {
  const postListRef = ref(db, "users/" + userID + "/posts/" + contentID);
  remove(postListRef);
}

// Queries: Strava ------------------------------------------------------- //

/**
 * TODO:
 * Add Strava queries from firebase.js
 * Migrate changes in firebase.js to here
 *
 */

// ---------------------------------------------------------------------- //
