import { collection, doc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, events, users } from '../ContextAndConfig/firebaseConfig.js';
import {addOrganizeToUser, addAttendeesToUser, removeOrganizeToUser, removeAttendeesToUser} from './user.js';


export async function addEvent(name, details, attendees, dates, organizers){

    const eventDocRef = await addDoc(collection(db, 'events'), {
        eventName: name,
        description: details,
        attendees: attendees,
        dates: dates.map((date)=> ({date: date, available: []})),
        organizers: organizers
      });

    attendees.forEach(async(attendee) => {
      addAttendeesToUser(attendee.uid, eventDocRef.id);
    });
    organizers.forEach(async(organizer) => {
      addOrganizeToUser(organizer.uid, eventDocRef.id);
    });
      

}

export async function editEvent(id, name, details, attendees, dates, organizers, removedAttenders, removedOrganizers){
  
    const docRef = doc(db, 'events', id)

    await updateDoc(docRef, {
        eventName: name,
        description: details,
        attendees: attendees,
        dates: dates,
        organizers: organizers
      });

      //removedAttenders: just storing the userID
      removedAttenders.forEach(async(attendee) => {
        removeAttendeesToUser(attendee, id)
          .catch((e)=>{console.log(e)});
      });
      removedOrganizers.forEach(async(organizer) => {
        removeOrganizeToUser(organizer, id)
          .catch((e)=>{console.log(e)});
      });
      
      attendees.forEach(async(attendee) => {
        addAttendeesToUser(attendee.uid, id)
          .catch((e)=>{console.log(e)});
      });
      organizers.forEach(async(organizer) => {
        addOrganizeToUser(organizer.uid, id)
          .catch((e)=>{console.log(e)});
      });

}

export function userInList(list, userId){
  return list?.some(
    (item)=>(item.uid == userId));
}