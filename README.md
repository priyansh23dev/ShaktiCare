# 🌸 ShaktiCare - Support for Women in Need

**ShaktiCare** is a mobile app that connects **victims of domestic violence**, **NGOs**, **donors**, and **consultants** to build a support system for women in distress. The app offers features like anonymous help requests, donations, scheduled counseling, and secure communication.

---

## 📱 Features

- Victims can raise help requests anonymously.
- NGOs and consultants can accept and manage those requests.
- Donors can donate directly to NGOs or victims.
- Consultants can schedule support sessions.
- Role-based login for each user type.
- Firebase Auth + Firestore-powered backend.

---

## 🏗️ Codebase Overview

- `src/screens/`: All screen components (Donor, NGO, Victim, Consultant).
- `src/navigation/`: React Navigation stack setup.
- `src/firebase.js`: Firebase config and initialization.
- `src/components/`: Reusable components (UI cards, buttons, loaders).
- `src/utils/`: Utility files (formatters, validators).

---

## ⚙️ Firebase Setup

Make sure you have a Firebase project created and the Android/iOS app added.

### Required Firebase services:
- Firebase Authentication
- Cloud Firestore
- Firebase Storage (optional for images)
- Firebase Messaging (optional for push notifications)

---

## 🔧 Installation & Running Locally

```bash
git clone https://github.com/your-username/shakticare.git
cd shakticare
npm install

# Link fonts if used
npx react-native link

# Run on Android
npx react-native run-android
