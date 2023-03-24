// imports
import { sendEmailVerification } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, Facebook, GitHub, Google } from "../firebase";
import { readProfileData, writeUserCreationDetails } from "../database";

// create a context for the session
const AuthContext = createContext();

/**
 * Enables use of the created context.
 */
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState();
  const [message, setMessage] = useState();

  const getUserData = async (user) => {
    // attempt to read given user's profile data
    const profile = (await readProfileData(user?.uid)) || {};
    setProfileData(profile);
  };

  useEffect(() => {
    return auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      getUserData(user);
      // if the user's email is not yet verified
      // warn them about this
      setWarning(
        user && !user.emailVerified
          ? "Access limited, verify email and refresh"
          : ""
      );
      setMessage();
      setLoading(false);
    });
  }, []);

  // Authentication methods -------------------------------------- //

  /**
   * Registers a user to the site, by creating an account from their data.
   *
   * @param {*} email The email inputted by the user in the "Email" field.
   * @param {*} password The password inputted by the user in the "Password" field.
   * @param {*} firstName The first name inputted by the user in the "First Name" field.
   * @param {*} lastName The last name inputted by the user in the "Last Name" field.
   * @returns The user Credential.
   */
  async function register(email, password, firstName, lastName) {
    const crs = await auth().createUserWithEmailAndPassword(email, password);
    // send the user a verification email and notify them
    sendEmailVerification(crs.user).then(setMessage("Verification email sent"));
    // write the user's details to the database
    writeUserCreationDetails(
      crs.user.uid,
      firstName,
      lastName,
      firstName + lastName,
      "/"
    );
    return crs;
  }

  function logout() {
    return auth().signOut();
  }

  /**
   * Gives the option to log in using username and password.
   * @param {String} email The email inputted in the "Email" field.
   * @param {String} password The password inputted in the "Password" field.
   */
  function login(email, password) {
    return auth()
      .signInWithEmailAndPassword(email, password)
      .then(setMessage());
  }

  /**
   * Gives the option to log in to the app using a GitHub account.
   */
  async function loginWithGithub() {
    const crs = await auth().signInWithPopup(GitHub);
    if (crs.user.metadata.creationTime === crs.user.metadata.lastSignInTime) {
      const name = crs.user.displayName.split(" ");
      writeUserCreationDetails(
        crs.user.uid,
        name[0],
        name[1],
        crs.user.displayName,
        crs.user.photoURL
      );
    }
    return crs;
  }

  /**
   * Gives the option to log in to the app using a Google account.
   */
  async function loginWithGoogle() {
    const crs = await auth().signInWithPopup(Google);
    if (crs.user.metadata.creationTime === crs.user.metadata.lastSignInTime) {
      const name = crs.user.displayName.split(" ");
      writeUserCreationDetails(
        crs.user.uid,
        name[0],
        name[1],
        crs.user.displayName,
        crs.user.photoURL
      );
    }
    return crs;
  }

  /**
   * Gives the option to log in to the app using a Facebook account.
   */
  async function loginWithFacebook() {
    const crs = await auth().signInWithPopup(Facebook);
    if (crs.user.metadata.creationTime === crs.user.metadata.lastSignInTime) {
      const name = crs.user.displayName.split(" ");
      writeUserCreationDetails(
        crs.user.uid,
        name[0],
        name[1],
        crs.user.displayName,
        crs.user.photoURL
      );
    }
    return crs;
  }

  // ------------------------------------------------------------- //

  // Additional methods ------------------------------------------ //

  /**
   * Send a password reset link to the given email.
   * @param {String} email The email inputted in the "Email" field,
   */
  function resetPassword(email) {
    return (
      auth()
        // send the password reset link
        .sendPasswordResetEmail(email)
        // notify the user
        .then(setMessage(""))
    );
  }

  // ------------------------------------------------------------- //

  const value = {
    currentUser,
    profileData,
    warning,
    message,
    register,
    logout,
    login,
    loginWithGithub,
    loginWithGoogle,
    loginWithFacebook,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
