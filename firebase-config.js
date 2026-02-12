// Firebase Configuration
// Replace with your Firebase project credentials
// Get these from Firebase Console > Project Settings > General

const firebaseConfig = {
apiKey: "AIzaSyBacCKcBoD-DLyRxMdVWLtxMuS3oY2GMJY",
  authDomain: "soccer-hub-pro.firebaseapp.com",
  databaseURL: "https://soccer-hub-pro-default-rtdb.firebaseio.com",
  projectId: "soccer-hub-pro",
  storageBucket: "soccer-hub-pro.firebasestorage.app",
  messagingSenderId: "1018713445784",
  appId: "1:1018713445784:web:02b286c24e2c07f4847ed"};

// Initialize Firebase
let app, auth, db;

function initializeFirebase() {
  try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.database();
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}

// Social Auth Providers
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const appleProvider = new firebase.auth.OAuthProvider('apple.com');

// Sign in with Google
function signInWithGoogle() {
  return auth.signInWithPopup(googleProvider)
    .then((result) => {
      console.log('Google sign-in successful:', result.user);
      return result.user;
    })
    .catch((error) => {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed: ' + error.message);
      throw error;
    });
}

// Sign in with Facebook
function signInWithFacebook() {
  return auth.signInWithPopup(facebookProvider)
    .then((result) => {
      console.log('Facebook sign-in successful:', result.user);
      return result.user;
    })
    .catch((error) => {
      console.error('Facebook sign-in error:', error);
      alert('Facebook sign-in failed: ' + error.message);
      throw error;
    });
}

// Sign in with Apple
function signInWithApple() {
  return auth.signInWithPopup(appleProvider)
    .then((result) => {
      console.log('Apple sign-in successful:', result.user);
      return result.user;
    })
    .catch((error) => {
      console.error('Apple sign-in error:', error);
      alert('Apple sign-in failed: ' + error.message);
      throw error;
    });
}

// Email/Password Sign Up
function signUpWithEmail(email, password) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log('Email sign-up successful:', userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error('Email sign-up error:', error);
      alert('Sign up failed: ' + error.message);
      throw error;
    });
}

// Email/Password Sign In
function signInWithEmail(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log('Email sign-in successful:', userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error('Email sign-in error:', error);
      alert('Sign in failed: ' + error.message);
      throw error;
    });
}

// Sign Out
function signOut() {
  return auth.signOut()
    .then(() => {
      console.log('Sign out successful');
    })
    .catch((error) => {
      console.error('Sign out error:', error);
    });
}

// Auth State Observer
function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}

// Database Operations
class FirebaseDB {
  // Save user data
  static saveUser(userId, userData) {
    return db.ref('users/' + userId).set(userData)
      .then(() => console.log('User data saved'))
      .catch((error) => console.error('Error saving user:', error));
  }

  // Get user data
  static getUser(userId) {
    return db.ref('users/' + userId).once('value')
      .then((snapshot) => snapshot.val())
      .catch((error) => {
        console.error('Error getting user:', error);
        return null;
      });
  }

  // Update user data
  static updateUser(userId, updates) {
    return db.ref('users/' + userId).update(updates)
      .then(() => console.log('User data updated'))
      .catch((error) => console.error('Error updating user:', error));
  }

  // Save game data
  static saveGame(gameData) {
    const newGameRef = db.ref('games').push();
    return newGameRef.set(gameData)
      .then(() => {
        console.log('Game saved with ID:', newGameRef.key);
        return newGameRef.key;
      })
      .catch((error) => console.error('Error saving game:', error));
  }

  // Get all games
  static getGames() {
    return db.ref('games').once('value')
      .then((snapshot) => {
        const games = [];
        snapshot.forEach((child) => {
          games.push({ id: child.key, ...child.val() });
        });
        return games;
      })
      .catch((error) => {
        console.error('Error getting games:', error);
        return [];
      });
  }

  // Save team data
  static saveTeam(teamData) {
    const newTeamRef = db.ref('teams').push();
    return newTeamRef.set(teamData)
      .then(() => {
        console.log('Team saved with ID:', newTeamRef.key);
        return newTeamRef.key;
      })
      .catch((error) => console.error('Error saving team:', error));
  }

  // Get all teams
  static getTeams() {
    return db.ref('teams').once('value')
      .then((snapshot) => {
        const teams = [];
        snapshot.forEach((child) => {
          teams.push({ id: child.key, ...child.val() });
        });
        return teams;
      })
      .catch((error) => {
        console.error('Error getting teams:', error);
        return [];
      });
  }

  // Save rating
  static saveRating(ratingKey, ratingData) {
    return db.ref('ratings/' + ratingKey).set(ratingData)
      .then(() => console.log('Rating saved'))
      .catch((error) => console.error('Error saving rating:', error));
  }

  // Get all ratings
  static getRatings() {
    return db.ref('ratings').once('value')
      .then((snapshot) => snapshot.val() || {})
      .catch((error) => {
        console.error('Error getting ratings:', error);
        return {};
      });
  }

  // Save check-in
  static saveCheckin(gameId, userId) {
    return db.ref('checkins/' + gameId + '/' + userId).set(true)
      .then(() => console.log('Check-in saved'))
      .catch((error) => console.error('Error saving check-in:', error));
  }

  // Get game check-ins
  static getGameCheckins(gameId) {
    return db.ref('checkins/' + gameId).once('value')
      .then((snapshot) => {
        const checkins = [];
        snapshot.forEach((child) => {
          checkins.push(child.key);
        });
        return checkins;
      })
      .catch((error) => {
        console.error('Error getting check-ins:', error);
        return [];
      });
  }

  // Get all check-ins
  static getAllCheckins() {
    return db.ref('checkins').once('value')
      .then((snapshot) => {
        const checkins = {};
        snapshot.forEach((gameChild) => {
          const gameId = gameChild.key;
          checkins[gameId] = [];
          gameChild.forEach((userChild) => {
            checkins[gameId].push(userChild.key);
          });
        });
        return checkins;
      })
      .catch((error) => {
        console.error('Error getting all check-ins:', error);
        return {};
      });
  }

  // Get all users
  static getAllUsers() {
    return db.ref('users').once('value')
      .then((snapshot) => snapshot.val() || {})
      .catch((error) => {
        console.error('Error getting users:', error);
        return {};
      });
  }

  // Listen to real-time updates
  static listenToPath(path, callback) {
    const ref = db.ref(path);
    ref.on('value', (snapshot) => {
      callback(snapshot.val());
    });
    return ref; // Return reference so it can be unsubscribed later
  }

  // Stop listening
  static stopListening(ref) {
    if (ref) {
      ref.off();
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeFirebase,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    onAuthStateChanged,
    FirebaseDB
  };
}
