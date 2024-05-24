# SoPra FS24 Group 43

<h3 align="center">
  <br>
  <img src="/ReadMeImages/logo18.png" height="200"></a>
</h3>

## Introduction

Freitagsmaler is a game where one user draws a word, while the other players try to guess what word they
are drawing, similar to games such as Pictionary. Users can either create an account or play as a guest user.
In order to play, players must either create or join a lobby, where they can change the game settings, such
as number of rounds or turn duration. The guessers see what the drawer is drawing in real time, and can use the
chat window to both just chat and guess the word. Once the time has run out or all players have guessed correctly,
each player gets points, and at the end of the game a final leaderboard is displayed, showing who won.

This is the repository for the frontend part of the implementation. The backend can be found
[here](https://github.com/sopra-fs24-group-43/server).

## Technolgies

The frontend is written using TypeScript and uses REACT, while scss is used for styling.

For general client to server communication REST API is used. Within a game and for inviting players, as well as 
retrieving the list of active games, a websocket connection is established using STOMP.

## High-Level Components

### [Landing Page](https://github.com/sopra-fs24-group-43/client/blob/main/src/components/views/LandingPage.tsx)

From the landing page users can reach the login page, as well as join an active game. A list displaying all currently
active games is updated here using a websocket connection whenever a player joins a lobby or a new lobby is opened or
deleted, etc.

### [Lobby](https://github.com/sopra-fs24-group-43/client/blob/main/src/components/views/Lobby.tsx)

Within the lobby, players can see the games current settings, see who else is in the lobby with them, and use the chat
to speak with the other players. One user (the one who created the game) is the admin, and only they can change 
settings and start the game. All information here is communicated using websockets.

### [Game](https://github.com/sopra-fs24-group-43/client/blob/main/src/components/views/Game.tsx)

The game consists of a leaderboard, showing which player has how many points, a chat window, which is also used for 
guessing the correct word, and the canvas, which is used for drawing. Only the user designated as drawer can use it, 
and what he draws is sent to each other user using websockets. Between each turn, the drawer can choose one of three
words to draw, and at the end a leaderboard is displayed, showing the final point totals and rankings. Here as well, 
all communication happens through websockets.

## Launch & Deployment

### Development mode

    npm run dev

This runs the app in development mode. Open [localhost:3000](http://localhost:3000) to view it in the browser.

### Build

    npm run build

## Illustrations

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Landing%20Page%201.png" height="400"></a>
  <br>
  Landing Page - What every user sees when they first visit the website.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Login%20and%20Register.png" height="400"></a>
  <br>
  Login and Register Page - If a user does not wish to play as guest, they can create an account or login to an 
existing account here.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Landing%20Page%202.png" height="400"></a>
  <br>
  View open lobbies - Once logged in (either with account or as guest), a user can see all open lobbies from the landing page.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Create%20Lobby.png" height="400"></a>
  <br>
  Create Lobby - A user that creates a lobby will have permissions to change the game's settings.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Select%20Word%201.png" height="400"></a>
  <br>
  Word selection - When a game starts, and before every turn, the drawer needs to choose a word.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Drawer%20View.png" height="400"></a>
  <br>
  Drawer view - The drawer has access to all drawing tools.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Guesser%20View.png" height="400"></a>
  <br>
  Guesser view - As a guesser, you see what the drawer is drawing and use the chat to guess the word.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Podium.png" height="400"></a>
  <br>
  Podium - At the end of the game, the final ranking is displayed for all.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Global%20Leaderboard.png" height="400"></a>
  <br>
  Global leaderboard - Here, you can see how many points players have accrued over the games they played, and how
they compare to other players.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Profile%20View.png" height="400"></a>
  <br>
  Profile view - Here, a user can view their own profile.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Settings%20popup.png" height="400"></a>
  <br>
  Settings menu - Allows a user to change the hotkeys to be used while drawing, as well as change the color scheme of 
of the site to darkmode.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/Darkmode.png" height="400"></a>
  <br>
  Darkmode Landing Page - The color scheme of the dark mode.
  <br>
</h3>

<h3 align="center">
  <br>
  <img src="/ReadMeImages/testImage.png" height="400"></a>
  <br>
  Friends list - A user's friends list appears as a popup window next to the button.
  <br>
</h3>





## Roadmap

- Custom word lists
- Audio Feedback on events such as a correct guess, turn end, etc.
- An achievements system

## Authors and acknowledgement

SoPra FS24 Group 43 consists of  [Markiian Dobosh](https://github.com/MarkiianDobosh),
[Dominique Heller](https://github.com/dominiqueheller), [Simon Klipp](https://github.com/simonkli),
[FLorian Mattmüller](https://github.com/FloMatt12), and [Robin Stirnimann](https://github.com/RobinStirnimann)

Special thanks to our teaching assistant [Marco Leder](https://github.com/marcoleder).

## License

Apache-2.0 license
