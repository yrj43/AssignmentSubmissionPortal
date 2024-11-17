# AssignmentSubmissionPortal

## Set Up

`https://github.com/yrj43/AssignmentSubmissionPortal.git`

## Installation

`npm install`

`node src/scripts/initDb.js`

`node src/app.js`

## Features

### Users can:

- Register and log in.
- Upload assignments.

### Endpoints:

- `POST /register` - Register a new user.
- `POST /login` - User login.
- `POST /upload` - Upload an assignment.
- `GET /admins`- fetch all admins

### Admins can:

- Register and log in.
- View assignments tagged to them.
- Accept or reject assignments.

### Admin Endpoints:

- `POST /register` - Register a new admin.
- `POST /login` - Admin login.
- `GET /assignments` - View assignments tagged to the admin.
- `POST /assignments/:id/accept` - Accept an assignment.
- `POST /assignments/:id/reject` - Reject an assignment.

## Technologies Used

Database: MongoDB




