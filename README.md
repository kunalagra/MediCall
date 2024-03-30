<h1 align="center">
  <br>
  <a href="https://medicall.onrender.com/"><img src="https://raw.githubusercontent.com/kunalagra/MediCall/main/medicall/public/logo512.png" alt="MediCall" width="200"></a>
  <br>
  MediCall
  <br>
</h1>

<h4 align="center">AIO Digital Hospital Platform.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

![screenshot](https://raw.githubusercontent.com/kunalagra/MediCall/main/medicall/public/screenshot.png)

## Key Features

* 2 types of User - Doctor & Patients
* Patients Features
  - Schedule Video calls with doctors
  - Provide Feedback to Doctor after Video 
  - Update and view Profile
  - Shop at E-Pharmacy
  - View Previous Orders and Prescriptions
  - Wallet System with Stripe for payments
    
* Instructor Features
  - Add Details
  - Set Availability
  - Join video calls
  - Write Prescription for Patients after meet
    
* Smart Queue Management
* Email & Whatsapp Supprt for Notifications
* Disease Prediction Model
* Personalized Chatbot

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) & [Python](https://www.python.org/) installed. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/kunalagra/MediCall

# Go into the repository
$ cd MediCall

# For frontend
$ cd medicall

# Install dependencies
$ npm install

# Rename .env.example to .env
$ mv .env.example .env

# Run the app
$ npm run dev

# For Backend
$ cd server

# Install dependencies
$ pip install -r requirements.txt

# Rename .env.example to .env
$ mv .env.example .env

# Run the server
$ flask run 
```
> [!IMPORTANT]  
> Populate your .env keys with their respective values. 

> [!NOTE]
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Credits

This software uses the following packages:

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)
- [React.JS](https://react.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Jitsi](https://github.com/jitsi/jitsi)

Built at GFG's Solving for India Hackathon


## You may also like...

- [SumUp](https://github.com/kunalagra/SumUp) - Summarize TEAMs Meeting
- [Codegamy](https://github.com/kunalagra/codegamy) - A LeetCode clone

## License

AGPL-3
