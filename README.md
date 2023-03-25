# StepUp

<img width="75px" height="75px" src= "https://github.com/milesmfe/StepUp/blob/main/public/images/icon.png"/>

Cloned from [ECM2434](https://github.com/oll-ie/ECM2434-CA), a group project that I worked on as part of our University of Exeter Group Software Engineering Project Feb/March 2023 coursework.

## Description

An activity tracking web application, where users can:

* Create and verify an account
* Login
* Link their account to their [Strava](https://www.strava.com/) account
* Automatically log their recent walking activities on and around campus
* Follow their friends to view their activites
* Score points on leaderboards for completing activites
* Grow their garden the more they play
* Become a member of a more sustainable community

## Getting Started

To get started simply visit [StepUp](https://stepup-sustainable.web.app/) to create your own account.

### Dependencies

This project was written/created using the following frameworks:

* [React.js frontend development tools](https://react.dev/)
* [Strava developer API](https://developers.strava.com/)
* [Firebase app development platform](https://firebase.google.com/)
* [Github](https://github.com/oll-ie/ECM2434-CA)
* [Trello kanban board](https://trello.com/b/310tGNpy/kanban-ecm2434)
* [NodeJS](https://nodejs.org/en/)

The system is written in:

* HTML
* CSS
* JavaScript (JS and JSX)

## File Structure

* Firebase Authentication<sup>1</sup>
* Firebase Realtime Database<sup>1</sup>
* React Frontend
* Public directory<sup>2</sup>
  * Images
  * Logo variations
  * Mobile app icon
  * HTML index<sup>3</sup>
  * Manifest file, enabling mobile support.
  * Robots file, to manage non-human access.
* Node.js package management and storage
* Firebase admin credentials
* Source Code
  * Firebase admin connection (authentication & database)
  * Activity monitoring (Strava) API connection
  * Session/State/Cookie management
  * JavaScript index<sup>3</sup>
  * Utilities
  * App layout
  * App theme
  * Routing rules
  * App Components
  * Navigation Bar
  * Garden
    * Garden components
  * Profile
    * Profile components
  * User Registration
  * User Login
  * User Password Reset
  * User Settings
  * 404 Error page
  * App Tests
  * Jest tests
  * Unit tests

<sup>1</sup>The Firebase backend is the only part of the system not stored in the project directory, rather it is managed via the Firebase console which is accessed via this website.

<sup>2</sup>This is the only directory directly accessible from the browser, although JSX components are injected from the source code.

<sup>3</sup>HTML index creates a root division in the website document onto which JavaScript index renders the React.js application.

## Tests

[![Deploy to Firebase](https://github.com/milesmfe/StepUp/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/milesmfe/StepUp/actions/workflows/firebase-hosting-merge.yml)

[Click here](https://universityofexeteruk-my.sharepoint.com/:x:/r/personal/mab262_exeter_ac_uk/Documents/ECM2434/StepUp_application_testing_doccument.xlsx?d=w178d1380b99b43e29f41bbb771c62c4f&csf=1&web=1&e=oOiRBO) to view the application testing document

## Authors

* Miles Edwards - me454@exeter.ac.uk
* Reuben Kurian - rk509@exeter.ac.uk
* Darren Gitagama - dg451@exeter.ac.uk
* Oliver Bezzant - ojb212@exeter.ac.uk
* Jack Souster - jis206@exeter.ac.uk
* Max Bennett - mab262@exeter.ac.uk

## Version History

* 0.1
  * Initial Release
