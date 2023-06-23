interface FirebaseError {
    [key: string]: string;
}

export const FIREBASE_ERRORS: FirebaseError = {
    "Firebase: Error (auth/email-already-in-use).": "A user with that email already in use.",
    "Firebase: Error (auth/invalid-email).": "Invalid email or password.",
    "Firebase: Error (auth/wrong-password).": "Invalid password or email.",
    "Firebase: Error (auth/user-not-found).": "Email address not found.",
    "Firebase: Password should be at least 6 characters (auth/weak-password).": "Password should be at least 6 characters.",
    "Firebase: Error (auth/popup-closed-by-user).": "Error auth/popup-closed-by-user.",
    "Passwords do not match.":"Passwords do not match."
}