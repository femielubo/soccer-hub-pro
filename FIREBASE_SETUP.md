# Firebase Setup Guide for Soccer Hub Pro

This guide will help you integrate Firebase cloud database and social authentication (Google, Apple, Facebook) into your Soccer Hub Pro application.

## Prerequisites

- A Google account
- Node.js installed (optional, for local development)
- Basic understanding of Firebase

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `soccer-hub-pro` (or your preferred name)
4. Enable/disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Register Your Web App

1. In Firebase Console, click the web icon (</>) to add a web app
2. Register app with nickname: `Soccer Hub Pro Web`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Copy the Firebase configuration object** - you'll need this!

## Step 3: Configure Firebase in Your App

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com"
};
```

## Step 4: Enable Authentication Methods

### Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click **Email/Password**
3. Enable the toggle
4. Click **Save**

### Enable Google Sign-In

1. In **Sign-in method**, click **Google**
2. Enable the toggle
3. Select a support email
4. Click **Save**

### Enable Facebook Sign-In

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add "Facebook Login" product
4. In Firebase Console, click **Facebook** in Sign-in methods
5. Copy the OAuth redirect URI from Firebase
6. In Facebook App Settings > Facebook Login > Settings:
   - Add the redirect URI to "Valid OAuth Redirect URIs"
7. Copy App ID and App Secret from Facebook
8. Paste them into Firebase Facebook settings
9. Enable and Save

### Enable Apple Sign-In

1. You need an Apple Developer account ($99/year)
2. In Firebase Console, click **Apple** in Sign-in methods
3. Enable the toggle
4. Follow the detailed setup instructions provided by Firebase
5. Configure your Service ID in Apple Developer Console
6. Enter Service ID and Team ID in Firebase
7. Save

**Note:** Apple Sign-In is more complex and requires additional configuration. For development/testing, you can skip this initially.

## Step 5: Set Up Realtime Database

1. In Firebase Console, go to **Realtime Database**
2. Click **Create Database**
3. Choose a location (select closest to your users)
4. Start in **Test mode** (for development)
   - **Important:** Test mode allows read/write access for 30 days
5. Click **Enable**

### Configure Security Rules (After Testing)

For production, update your database rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "games": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "teams": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "ratings": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "checkins": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Step 6: Test Your Integration

1. Open your app in a browser
2. Try creating an account with email/password
3. Try logging in with Google (and Facebook/Apple if configured)
4. Check Firebase Console > Authentication to see registered users
5. Check Realtime Database to see if data is being saved

## Troubleshooting

### Authentication Not Working

- Check that Firebase SDK scripts are loaded in index.html
- Verify firebase-config.js has correct credentials
- Check browser console for errors
- Ensure authentication methods are enabled in Firebase Console

### Database Not Saving Data

- Check Realtime Database rules (should allow write in test mode)
- Verify databaseURL in firebase-config.js is correct
- Check browser console for permission errors

### Social Login Errors

- **Google:** Ensure authorized domains include your hosting domain
- **Facebook:** Verify OAuth redirect URI matches exactly
- **Apple:** Confirm Service ID and Team ID are correct

## Security Best Practices

1. **Never commit firebase-config.js with real credentials to public repos**
   - Add it to .gitignore
   - Use environment variables for production

2. **Update Database Rules before going to production**
   - Test mode expires after 30 days
   - Implement proper authentication-based rules

3. **Enable App Check** (recommended for production)
   - Protects against abuse and unauthorized access

4. **Monitor Usage**
   - Check Firebase Console regularly
   - Set up budget alerts

## Next Steps

- Update `app.js` to integrate with Firebase functions
- Implement data migration from localStorage to Firebase
- Add real-time sync for multiplayer features
- Set up Firebase Hosting for deployment

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Realtime Database](https://firebase.google.com/docs/database)
- [Facebook Login Setup](https://firebase.google.com/docs/auth/web/facebook-login)
- [Apple Sign-In Setup](https://firebase.google.com/docs/auth/web/apple)

## Support

If you encounter issues:
1. Check Firebase Console > Authentication > Users
2. Check browser console for errors
3. Review Firebase documentation
4. Check Stack Overflow for similar issues

Good luck with your integration! 🚀⚽
