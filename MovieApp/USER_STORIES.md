# CineTrack – User Stories

## Project Overview
CineTrack is a mobile movie tracking app built with Expo (React Native) that allows users to discover, search, and save their favorite movies using the TMDB API.

---

## User Stories

### US-01 – User Registration
**As a** new user,  
**I want to** create an account with a username, email, and password,  
**So that** I can have a personalized experience in the app.

**Acceptance Criteria:**
- Registration form includes username, email, and password fields
- Validation prevents empty fields or weak passwords (less than 6 characters)
- Error message is shown if the email is already registered
- On success, the user is redirected to the Home screen

---

### US-02 – User Login
**As a** registered user,  
**I want to** log in using my email and password,  
**So that** I can securely access my saved movies and preferences.

**Acceptance Criteria:**
- Login form includes email and password fields
- Error message is displayed for incorrect credentials
- Successful login redirects to the Home screen
- Session persists using AsyncStorage

---

### US-03 – Browse Movies on Home Screen
**As a** logged-in user,  
**I want to** see trending, popular, and top-rated movies on the home screen,  
**So that** I can easily discover new films to watch.

**Acceptance Criteria:**
- Home screen displays three sections: Trending, Popular, Top Rated
- Each section shows horizontally scrollable movie cards with poster and rating
- App logo and settings menu icon are visible in the header
- Data is fetched from the TMDB external API

---

### US-04 – View Movie Details
**As a** user browsing movies,  
**I want to** tap on a movie card to see detailed information,  
**So that** I can learn more about a movie before deciding to watch it.

**Acceptance Criteria:**
- Detail screen shows movie title, poster, backdrop, rating, genres, runtime, and overview
- Top cast members are displayed with photos and character names
- A navigation icon (back button) returns the user to the previous screen
- The detail screen is reachable from Home, Search, and Favorites

---

### US-05 – Save Movies to Favorites
**As a** user who likes a movie,  
**I want to** add it to my Favorites list,  
**So that** I can easily find and revisit it later.

**Acceptance Criteria:**
- A heart icon on the detail screen toggles the favorite status
- Favorites are stored in AsyncStorage (local persistent storage)
- Favorites persist across app restarts
- The Favorites tab shows all saved movies with the option to remove them

---

### US-06 – Search for Movies
**As a** user looking for a specific film,  
**I want to** search movies by title,  
**So that** I can quickly find what I'm looking for.

**Acceptance Criteria:**
- Search bar is accessible from the Search tab
- Results update after the user submits the query
- If no results are found, a relevant message is displayed
- Each result card navigates to the Movie Detail screen

---

### US-07 – Configure App Settings
**As a** user,  
**I want to** access a Settings screen with app preferences,  
**So that** I can customize my experience.

**Acceptance Criteria:**
- Settings screen is accessible via the menu icon on the Home screen
- Settings include toggles for Dark Mode, High Quality Images, and Auto-Play
- Language selection and a Clear Cache option are available
- Settings changes are saved to AsyncStorage

---

### US-08 – Manage Notifications
**As a** user,  
**I want to** configure and receive push notifications,  
**So that** I can stay updated about new and trending movies.

**Acceptance Criteria:**
- Notifications screen shows current permission status
- Users can request notification permissions from within the app
- Toggles are available for Weekly Trending, New Releases, and Trending Alerts
- A test notification can be triggered to verify setup
- Weekly notifications can be scheduled for Monday mornings

---

### US-09 – View My Profile
**As a** logged-in user,  
**I want to** view my profile with account details and quick access to app features,  
**So that** I can manage my account and navigate the app easily.

**Acceptance Criteria:**
- Profile screen shows username, email, member since date, and favorite count
- Quick links to Favorites, Settings, and Notifications are accessible
- A Sign Out button logs the user out and redirects to the Login screen
- Profile data is loaded from AsyncStorage
