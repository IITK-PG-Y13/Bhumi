import firebase from 'firebase/app';
import firestore from 'firebase/database';
import firebaseConfig from './config';

const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.database()
