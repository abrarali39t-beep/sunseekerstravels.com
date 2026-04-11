# ☀️ Sun Seekers Travels — Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to → https://console.firebase.google.com
2. Click **"Add project"** → Name it `sunseekerstravels`
3. Disable Google Analytics (optional) → Click **Create Project**

---

## Step 2: Enable Authentication

1. In Firebase Console → **Authentication** → **Get Started**
2. Click **Email/Password** → Toggle **Enable** → Save
3. Go to **Users** tab → **Add User**
   - Email: `admin@sunseekerstravels.com`
   - Password: (choose a strong password)
   - Click **Add User**

---

## Step 3: Create Firestore Database

1. In Firebase Console → **Firestore Database** → **Create Database**
2. Choose **Start in test mode** (we'll secure it later)
3. Select region: `asia-south1` (Mumbai — closest to Kashmir)
4. Click **Done**

---

## Step 4: Get Your Firebase Config

1. In Firebase Console → Project Settings (⚙️ gear icon)
2. Under **"Your apps"** → Click **Web** icon (`</>`)
3. Register app name: `sunseekerstravels-web`
4. Copy the `firebaseConfig` object shown

---

## Step 5: Update firebase-config.js

Open `firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy...",           // ← your actual key
  authDomain:        "sunseekerstravels.firebaseapp.com",
  projectId:         "sunseekerstravels",
  storageBucket:     "sunseekerstravels.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef"
};
```

---

## Step 6: Set Firestore Security Rules

In Firebase Console → Firestore → **Rules** tab, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read for website content
    match /hotels/{doc}       { allow read: if true; allow write: if request.auth != null; }
    match /fleet/{doc}        { allow read: if true; allow write: if request.auth != null; }
    match /packages/{doc}     { allow read: if true; allow write: if request.auth != null; }
    match /testimonials/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /gallery/{doc}      { allow read: if true; allow write: if request.auth != null; }
    match /settings/{doc}     { allow read: if true; allow write: if request.auth != null; }

    // Bookings — public write (visitors submit forms), only admin reads
    match /bookings/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

Click **Publish**.

---

## Step 7: Seed Default Data

1. Open `admin.html` in your browser
2. Login with the admin email & password you created in Step 2
3. Go to **Settings** → Click **"Seed Default Hotels"** and **"Seed Default Fleet"**
4. This populates Firestore with the default content

---

## Step 8: Deploy (Optional)

### Option A — Firebase Hosting (Free)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to your project folder
firebase deploy
```

### Option B — Any Static Host
Upload all `.html`, `.css`, `.js` files to:
- Netlify (drag & drop at netlify.com)
- Vercel
- cPanel File Manager
- GitHub Pages

---

## File Structure

```
sunseekerstravels/
├── index.html          ← Homepage (with Hotels section)
├── about.html          ← About page
├── fleet.html          ← Vehicle fleet
├── services.html       ← Services
├── packages.html       ← Tour packages
├── gallery.html        ← Photo gallery
├── contact.html        ← Contact + booking form
├── faq.html            ← FAQ page
├── admin.html          ← Admin panel (Firebase powered)
├── firebase-config.js  ← 🔑 YOUR FIREBASE CREDENTIALS HERE
├── styles.css          ← Global styles
└── main.js             ← Shared JS (nav, animations)
```

---

## Admin Panel Features

| Section      | Features |
|-------------|---------|
| 🏨 Hotels   | Add, Edit, Delete hotels with star ratings, images, amenities, pricing |
| 🚗 Fleet    | Manage vehicle listings with categories, seats, features |
| 🗺️ Packages | Create and edit tour packages with highlights |
| ⭐ Reviews  | Manage customer testimonials |
| 📋 Bookings | View all form submissions, update status (New → Confirmed → Completed) |
| 🖼️ Gallery  | Add/remove gallery photos |
| ⚙️ Settings | Update business info, change admin password, seed default data |

---

## WhatsApp Quick Links

Your booking forms send data to:
- Firebase Firestore (admin panel)
- WhatsApp: https://wa.me/916005868858

Both work simultaneously for maximum reach! ✅
