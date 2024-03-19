import { collection, doc, addDoc, updateDoc, arrayUnion,arrayRemove } from 'firebase/firestore';
import { db} from '../ContextAndConfig/firebaseConfig.js'

export async function addOrganizeToUser(uid, eventID){
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        organize: arrayUnion(eventID)
    });
}

export async function addAttendeesToUser(uid, eventID){
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        events: arrayUnion(eventID)
    });
}

export async function removeOrganizeToUser(uid, eventID){
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        organize: arrayRemove(eventID)
    });
}

export async function removeAttendeesToUser(uid, eventID){
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        events: arrayRemove(eventID)
    });
}