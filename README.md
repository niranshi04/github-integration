## Description

It is a Github integration app using which one can authenticate using Github and add Repository to his/her github account.

## Installation
```bash
$ git clone https://github.com/niranshi04/github-integration.git
$ cd github-integration
$ npm install
```

## Running the app

```bash
# development
$ npm run start

```

## Features
The main features of this website are:
1) Github login using Passport library of nest.js.
2) Create a new repository with a default Readme file.
3) The User session expires automatically in an hour using the cookies usage.
4) The User's details of the github login session is stored in sqlite db.
5) User can logout and view the github profile.