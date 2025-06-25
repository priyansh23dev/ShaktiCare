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



🚀 Going to Production (Google Play Store)
✅ Final Preparation
Remove console logs and dev dependencies.

Optimize images and assets.

Test all user flows with real Firebase data.

🛡 Secure Firebase Rules:
js
Copy
Edit
match /{document=**} {
  allow read, write: if request.auth != null;
}
🛠 Build Production APK or AAB:
bash
Copy
Edit
cd android
./gradlew assembleRelease      # APK
./gradlew bundleRelease        # AAB (Recommended for Play Store)
Output is saved in:

swift
Copy
Edit
android/app/build/outputs/apk/release/
android/app/build/outputs/bundle/release/
🛒 Google Play Store Upload
Go to Google Play Console.

Create a new app: ShaktiCare

Upload the app-release.aab file.

Add screenshots, icons, privacy policy (hosted on GitHub Pages or Firebase Hosting).

Fill in app details (title, short & full description).

Choose pricing (Free).

Publish — approval usually takes 3–7 days.

📡 Firebase Structure
users (collection)
Field	Description
uid	User ID (Firebase Auth)
name	Full name
email	Email address
role	'Victim', 'NGO', etc.

helpRequests
Field	Description
uname	Name of requester
assignedConsultant	UID of assigned consultant
requestType	e.g., "legal", "medical"
status	'Pending', 'Accepted', etc.
scheduledAt	DateTime (Timestamp)

donations
Field	Description
donorId	Firebase UID of donor
recipientId	UID of NGO or Victim
recipientRole	'NGO' or 'Victim'
amount	Donation amount ₹
createdAt	Timestamp

🔄 API Structure (Firebase)
This app uses Firebase as BaaS, so all data access is done via Firestore SDK. Here's an example:

js
Copy
Edit
firestore().collection('helpRequests')
  .where('assignedConsultant', '==', currentUser.uid)
  .get()
You can extend it by integrating REST APIs using Node.js if needed in future.

🔁 Process Flow (Diagram)
lua
Copy
Edit
+------------+           +------------+          +---------------+
|  Victim    |  --->     |  Consultant|  --->    |   Schedule    |
+------------+           +------------+          +---------------+
      |                         ↑
      v                         |
+------------+           +------------+
|    NGO     |  <---     |   Donor    |
+------------+           +------------+
Victim raises help request.

Consultant is assigned and responds.

Donor can donate to NGO/Victim.

NGO sees all requests, can help and monitor.

🔮 Future Scope
Add in-app chat between victim and consultant.

Enable video counseling sessions via WebRTC.

Provide multi-language support (Hindi, English, etc.).

Push notifications for request updates.

AI-based resource matching (assign consultants based on type).

Admin panel for moderation and management.

👤 Author
Made with 💜 by [Your Name]
React Native | Firebase | Human-Centric Design

📄 License
This project is open-sourced under the MIT License.

yaml
Copy
Edit

---

Let me know if you want:
- `.gitignore` template  
- `LICENSE` file  
- CI/CD setup with GitHub Actions  
- iOS deployment instructions  

I'll be happy to add it!






You said:
give porcee diagtam


ChatGPT said:
Here’s a simple process diagram in text format for your ShaktiCare app that you can include in your README or docs. It describes the main user flow and interactions:

pgsql
Copy
Edit
+----------------+          +----------------+          +----------------+
|     Victim     |          |   Consultant   |          |      Donor     |
+----------------+          +----------------+          +----------------+
        |                            |                            |
        | 1. Raise Help Request       |                            |
        |--------------------------->|                            |
        |                            |                            |
        |                            | 2. Accept or Reject Request |
        |                            |<---------------------------|
        |                            |                            |
        |                            | 3. Schedule Support Session|
        |                            |--------------------------->|
        |                            |                            |
        |                            |                            |
        |                            |                            |
        |                            | 4. View Scheduled Requests |
        |                            |<---------------------------|
        |                            |                            |
        |                            |                            |
        |                            |                            |
        |                            |                            |
        |                            |                            |
        |                            |                            |
+----------------+          +----------------+          +----------------+
|      NGO       |          |   Help Requests|          | Donation System|
+----------------+          +----------------+          +----------------+
        |                            |                            |
        | 5. Monitor Requests         |                            |
        |<-------------------------- |                            |
        |                            |                            |
        |                            |                            |
        | 6. Receive Donations        |                            |
        |<-------------------------- |                            |
        |                            |                            |
        |                            |                            |
        |                            |                            |
        |                            |                            |
        |                            |                            |
        |                            |                            |
Explanation:
Victim submits a help request.

Consultant views and either accepts or rejects the request.

If accepted, consultant schedules a support session.

Consultant views all scheduled help requests.

NGO monitors all help requests and provides assistance.

Donor can donate to victims or NGOs through the donation system.


