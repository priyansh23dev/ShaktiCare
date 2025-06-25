import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * Sign up new user with email and password
 * Then save extra profile data to Firestore
 */
export async function signUpUser({ name, email, password, role }) {
  try {
    // 1. Create user in Firebase Authentication
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);

    // 2. Save additional user info in Firestore 'users' collection
    await firestore()
      .collection('users')
      .doc(userCredential.user.uid)
      .set({
        name,
        email,
        role,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Login user with email and password
 */
export async function loginUser({ email, password }) {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    console.log(userCredential)
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
