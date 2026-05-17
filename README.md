# Family Meal Planner

A privacy-first, offline-capable meal planning app designed for a family of 4 in Adelaide, South Australia. Features allergy awareness (anaphylaxis to sesame/tree nuts), autism/PDA-friendly interfaces, and AI-powered recipe suggestions via OpenRouter.

![Family Planner](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🌟 Features

### Core Planning
- **7-Day Meal Planner** — Visual weekly grid with breakfast, lunch, dinner, and snacks
- **Drag & Drop** — Reorder meals within the week
- **Meal Library** — Store favorite meals with ingredients and instructions
- **Recipe URL Import** — Auto-import recipes from websites

### Shopping & Pantry
- **Smart Shopping List** — Auto-generated from meal plan, categorized by aisle
- **Pantry Tracker** — Track ingredients with expiry dates and quantities
- **Woolworths Integration** — Seeded with Woolworths receipt history
- **🔍 Woolworths Search Links** — One-click search for each shopping item
- **📋 Copy List** — Copy shopping list to clipboard for easy reference
- **Staples Reminders** — Get notified when essentials need repurchasing

### Dietary & Safety
- **Allergen Warnings** — Prominent alerts for sesame and tree nuts (anaphylaxis)
- **Dietary Filters** — Vegetarian, vegan, gluten-free tagging
- **Safe Food highlighting** — Green/yellow/red safety indicators

### Tech Features
- **Offline Support** — Service Worker + Firestore persistence (works without internet)
- **Push Notifications** — Staple due reminders (opt-in)
- **AI Recipe Suggestions** — Powered by Tencent Hy3 Preview via OpenRouter
- **Firebase Sync** — Cloud backup with authenticated access only

## 🚀 Quick Start

### 1. Clone the Repo
```bash
git clone https://github.com/nigelfacy/family-planner-app.git
cd family-planner-app
```

### 2. Serve the App (Any HTTP Server)
Since this is a client-side app, you need an HTTP server (not `file://`):

**Python:**
```bash
python3 -m http.server 8000
# Visit: http://localhost:8000/family-planner.html
```

**Node.js:**
```bash
npx serve .
# Visit the URL shown in terminal
```

**VS Code:** Install "Live Server" extension, right-click `family-planner.html` → "Open with Live Server"

### 3. Firebase Setup (Required for Data Persistence)

The app uses Firebase Firestore. You have two options:

**Option A: Use Existing Project (family-planner-5ed4a)**
- Visit [Firebase Console](https://console.firebase.google.com/project/family-planner-5ed4a)
- Deploy the `firestore.rules` file from this repo to enable production security rules
- The app is already configured with the correct project ID

**Option B: Create New Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/) → "Add Project"
2. Copy your Firebase config (Project Settings → General → Your Apps → Web App)
3. Edit `family-planner.html`, find `firebaseConfig` (line ~320), replace with your config
4. Update `firebase-messaging-sw.js` with your project credentials

### 4. Deploy Firestore Rules
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and deploy rules
firebase login
firebase init firestore  # Select your project
cp firestore.rules ./firestore.rules  # Ensure rules file is in project root
firebase deploy --only firestore:rules
```

Or manually: Firebase Console → Firestore Database → Rules → Paste `firestore.rules` content → Publish

## 📱 How to Use the App

### First Launch
1. Open `family-planner.html` in your browser
2. The app will prompt for Firebase authentication (if enabled)
3. You'll see the **Planner** tab active by default

### Tabs Overview

| Tab | Purpose |
|-----|---------|
| **📅 Planner** | 7-day meal grid (Mon-Sun) |
| **🛒 Shopping** | Auto-generated shopping list |
| **🥫 Pantry** | Track ingredients and expiry dates |
| **🍽️ Meals** | Your meal library |
| **🧂 Staples** | Essentials to repurchase regularly |
| **⚠️ Allergens** | Manage allergy safety |
| **📖 Recipes** | Import recipes from URLs |
| **⚙️ Settings** | App preferences + notifications |

### Adding Meals to the Planner
1. Go to **🍽️ Meals** tab → Click "Add Meal"
2. Fill in: Name, Type (breakfast/lunch/dinner/snack), Ingredients, Instructions
3. Tag allergens if needed (sesame, tree nuts, etc.)
4. Save the meal
5. Go to **📅 Planner** → Click any meal slot → Select your meal from the dropdown

### Generating a Shopping List
1. Plan your meals for the week in the **Planner** tab
2. Go to **🛒 Shopping** tab
3. Click **"🛒 Generate from Planner"** — the list auto-populates from meal ingredients
4. Check off items as you shop
5. Filter by: All, Pending, Purchased, or by aisle (Produce, Dairy, etc.)
6. Click **"🔍"** next to any item to search it on Woolworths website
7. Click **"📋 Copy List"** button to copy all items to clipboard

### Managing Pantry & Staples
1. **🥫 Pantry** → Add ingredients with quantities and expiry dates
2. **🧂 Staples** → Add essentials (milk, bread, etc.) with repurchase intervals
3. The app will show "DUE" badges when staples need buying
4. Enable **Push Notifications** in Settings to get reminders

### AI Recipe Suggestions
1. Go to **📖 Recipes** tab
2. Enter a recipe URL → Click "Import" (auto-fills ingredients/instructions)
3. Or click "AI Suggest" → Enter a prompt like "Quick vegetarian dinner for kids"
4. The app uses Tencent Hy3 Preview (via OpenRouter) to generate recipes

### Offline Mode
- The app works offline! Service Worker caches the app shell
- Firestore persistence saves data locally
- When back online, changes sync automatically
- Test: Chrome DevTools → Network → Check "Offline" → Reload the page

## 🔧 Advanced Configuration

### OpenRouter AI Setup
The app uses OpenRouter API for AI recipe suggestions. To use your own:
1. Get an API key from [OpenRouter](https://openrouter.ai/)
2. In `family-planner.html`, find `openRouterKey` (line ~335)
3. Replace with your key: `const openRouterKey = "sk-or-v1-...";`

### Push Notifications (Staples Due)
1. Enable notifications in **⚙️ Settings** → "🔔 Enable Staple Due Notifications"
2. Grant browser permission when prompted
3. The app uses Firebase Cloud Messaging (FCM)
4. For full push (even when app is closed), you need to set up FCM VAPID key:
   - Firebase Console → Project Settings → Cloud Messaging → Generate Key Pair
   - Add to `family-planner.html` in the `getToken()` call

### PDA/Autism-Friendly Features
- **No forced interactions** — All actions are user-initiated
- **Clear visual indicators** — Green (safe), Yellow (caution), Red (allergen)
- **Drag & drop** — Rearrange meals without deleting/re-adding
- **Simple language** — Avoids overwhelming text
- **Predictable layout** — Tabs always in same order

## 📂 File Structure

```
family-planner-app/
├── family-planner.html      # Main app (single-page HTML/CSS/JS)
├── service-worker.js        # Offline caching (Service Worker)
├── firebase-messaging-sw.js # Push notification handler
├── firestore.rules          # Firebase security rules (auth required)
└── README.md               # This file
```

## ⚠️ Important Notes

### Allergy Safety
- This app is a **planning tool only**
- Always **double-check ingredient labels** for allergens
- Anaphylaxis is life-threatening — carry EpiPens as prescribed
- The app shows warnings, but **you are responsible for verifying safety**

### Firestore Rules
- The `firestore.rules` file restricts access to **authenticated users only**
- Deploy these rules ASAP (Firebase test mode expires after 30 days)
- Without rules, your data is publicly readable/writable

### Offline Limitations
- Service Worker caches app shell only (not Firestore data — that's handled by Firestore persistence)
- First load requires internet (to cache the app)
- Push notifications require a service worker and FCM setup

## 🐛 Known Issues & Future Plans

### Known Limitations
- [ ] Firestore test mode rules expire soon (deploy `firestore.rules` to fix)
- [ ] Open Food Facts images are inconsistent
- [ ] No multi-user support (currently single-family only)
- [ ] Push notifications need FCM VAPID key for full background support

### Future Ideas
- [ ] Weekly spend estimates (Woolworths price integration)
- [ ] Barcode scanner for pantry items
- [ ] Woolworths online ordering integration (beyond search links)
- [ ] Multiple user profiles (kids can view but not edit)
- [ ] Recipe nutrition calculations

## 👨‍👩‍👧‍👦 Family Context

This app was built for:
- **Family of 4** in Adelaide, South Australia
- **2 kids with autism/PDA** (Pathological Demand Avoidance)
- **Anaphylaxis** to sesame seeds and tree nuts
- **Shopping at Woolworths** (SA)
- **Hosted on Netlify** with Firebase Firestore sync

## 📄 License

MIT License — Feel free to adapt for your own family!

## 🙏 Acknowledgments

- **Firebase** — Backend & authentication
- **OpenRouter** — AI recipe suggestions (Tencent Hy3 Preview)
- **Woolworths** — Pantry seeding from receipt history
- **Herman (Hermes Agent)** — Development assistant

---

**Made with ❤️ for families managing allergies, autism, and mealtime chaos.**
