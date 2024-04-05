import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, TextInput, FlatList, ScrollView} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { doc, getDoc, onSnapshot,Timestamp } from "firebase/firestore";

import { db } from '../ContextAndConfig/firebaseConfig.js'
import { UserContext } from '../ContextAndConfig/UserContext.js';
import SearchUserPage from './Search.js';
import styles from '../style.js';
import {userInList, editEvent} from '../DataClass/event.js'
import DateRow from '../Component/DateRow.js';
import { Namebox } from '../Component/NameBox.js';

const Stack = createNativeStackNavigator();

export default function Screen({ navigation }) {

    const user = useContext(UserContext);

    const [attenders, setAttenders] = useState([]);
    const [organizers, setorganizers] = useState([]);
    const [pending, setPending] = useState([]);

    //removedAttenders: just storing the userID
    const [removedAttenders, setRemovedAttenders] = useState([]);
    const [removedOrganizers, setRemovedOrganizers] = useState([]);
    const [removedPendings, setRemovedPendings] = useState([]);

    return(
    <Stack.Navigator initialRouteName="Event page"
    screenOptions={{headerShown: false}}>
        <Stack.Screen name="Event page">
            {(props) => <EventPage {...props} 
                            attenders={attenders} 
                            setAttenders={setAttenders} 
                            organizers={organizers} 
                            setorganizers={setorganizers}
                            removedAttenders={removedAttenders}
                            setRemovedAttenders={setRemovedAttenders}
                            removedOrganizers={removedOrganizers}
                            setRemovedOrganizers={setRemovedOrganizers}
                            removedPendings={removedPendings} 
                            setRemovedPendings={setRemovedPendings}
                            pending={pending}
                            setPending={setPending}/>}
        </Stack.Screen>
        <Stack.Screen name="Search User">
            {(props) => <SearchUserPage {...props} 
                            attenders={attenders} 
                            setAttenders={setAttenders} 
                            organizers={organizers} 
                            setorganizers={setorganizers}
                            removedAttenders={removedAttenders}
                            setRemovedAttenders={setRemovedAttenders}
                            pending={pending}
                            setPending={setPending}/>}
        </Stack.Screen>
    </Stack.Navigator>);

}

export function EventPage({ route, navigation, 
    attenders, setAttenders, 
    organizers, setorganizers, 
    removedAttenders, setRemovedAttenders,
    removedOrganizers, setRemovedOrganizers,
    removedPendings, setRemovedPendings,
    pending, setPending}) {

    const user = useContext(UserContext);
    
    const insets = useSafeAreaInsets();
    const [focus, setFocus] = useState('');

    const [eventName, setEventName] = useState('');
    const [details, setDetails] = useState('');
    const [times, setTimes] = useState([]);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [picking, setPicking] = useState(false);

    const [eventDoc, setEventDoc] = useState();

    const handleSubmit = ()=>{
        if(eventName.trim() && times.length && attenders.length){
        editEvent(user, eventID, eventName, details, attenders, times, organizers, removedAttenders, removedOrganizers, pending, removedPendings)
            .catch((e)=>{console.log(e)});
        navigation.goBack();
        }
    }

    const { eventID } = route.params;

    const fetchEvent = async (docRef) => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEventDoc(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
  
    useEffect(()=>{
  
      let unsub = () => {};
  
      if(eventID){
  
        const docRef = doc(db, "events", eventID);
  
        fetchEvent(docRef).catch(
          (e)=>{console.log(e)}
        )
  
        unsub = onSnapshot(docRef, async() => {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setEventDoc(docSnap.data());
          } else {
            console.log("No such document!");     
        }});
  
      };
  
      return unsub;
  
    },[]);

    
    const isOrganizer = userInList(eventDoc?.organizers ,user.uid);
    //console.log(isOrganizer);

    const onChange = (event, selectedDate) => {
        if(event.type == 'set'){
            const currentDate = selectedDate;
            setShow(false);
            setDate(currentDate);
            
            if(mode == 'time'){
                setTimes(times.concat([{
                    available: [],
                    date : Timestamp.fromDate(currentDate)
                }]));
            }
        }
        else if(event.type == 'dismissed'){
            setPicking(false);
            setShow(false);
        }

    };

    const showDatepicker = () => {
        setShow(true);
        setMode('date');
        setPicking('true');
    };
  
    const showTimepicker = () => {
        setShow(true);
        setMode('time');
    };

    const dateToString = (date) => {
        return(
            date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + '  ' +
            (date.getHours() < 10 ? '0' + date.getHours() :  date.getHours()) + ':' + 
            (date.getMinutes() < 10 ? '0' + date.getMinutes() :  date.getMinutes())
        );
    }

    const firebaseTimstampToDate = (timestamp) => {
        return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    }

    useEffect(()=>{
        if(picking && show == false && mode == 'date'){
            showTimepicker();
        }
        else if(picking && show == false && mode == 'time'){
            setPicking(false);
        }
    })

    useEffect(()=>{
        if(eventDoc){
            setEventName(eventDoc.eventName);
            setDetails(eventDoc.description);
            setTimes(eventDoc.dates);
            setAttenders(eventDoc.attendees);
            setorganizers(eventDoc.organizers);
            setPending(eventDoc.pending);
        }
    },[eventDoc])

    //console.log(removedOrganizers);

    return (
        <View id="safe_area_with_header" style={{
        height:'100%', width:'100%',
        paddingLeft: insets.left, paddingRight: insets.right
        }}>

            {show && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}/>
            )}
                
        <ScrollView style={{
                paddingTop: 30,
                paddingBottom: 0,
                paddingLeft: 30,
                paddingRight: 30}}>
            
            <View id='name_input' style={{marginBottom:10}}>
                <TextInput 
                    value={eventName} 
                    onChangeText={(value)=>{setEventName(value)}}
                    style={[
                        {fontWeight:'500', fontSize: 30}
                    ]}
                    placeholder='Event Name'
                />
            </View>

            <View id='details' style={{marginBottom:20}}>
                <TextInput 
                    value={details} 
                    onChangeText={(value)=>{setDetails(value)}}
                    style={[
                        styles.input, 
                        (focus == 'details' ? styles.focused : '')
                    ]}
                    placeholder='Description'
                    onFocus={() => setFocus('details')}
                    onBlur={() => setFocus('')}
                    multiline
                />
            </View>

            <Text style={styles.sectionTitle}>Organizer</Text>
            <Text style={{marginBottom:10}}>{organizers.map((organizer, index) => (organizer.name))}</Text>
            
            <Text style={styles.sectionTitle}>Attendees</Text>

            <View id='attendees' style={[styles.outlineButtonCluster,{marginBottom:10}]}>
                {attenders.map((attendees, index) => (
                    <View id='attendees_name' style={[styles.outlineButton,{marginBottom:10}]} key={index}> 
                        
                        <Text style={{}}> 
                            {attendees.name || attendees.email}
                        </Text>
                        
                        <Pressable onPress={()=>{
                            //removedAttenders: just storing the userID
                            if(!removedAttenders.includes(attendees.uid)){
                                setRemovedAttenders(removedAttenders.concat([attendees.uid]));
                            }

                            setTimes(
                                times.map((e)=>({
                                    date: e.date, 
                                    available: 
                                        e.available.filter((e)=>(
                                            e.uid != attendees.uid)
                                        )
                                }))
                            );

                            setAttenders(
                                attenders.slice(0, index)
                                .concat(
                                    attenders.slice(index+1)));
                        }}>

                            <Icon name="close" size={17} color="#333" style={{marginTop:2, marginLeft:3}}/>
                        </Pressable>

                    </View>
                ))}
                {pending.map((pendingUser, index) => (
                    <View id='pending_name' style={[styles.outlineButton,{marginBottom:10}]} key={index}> 
        
                        <Text style={{}}> 
                            {pendingUser.name || pendingUser.email} (pending)
                        </Text>
                        
                        <Pressable onPress={()=>{
                            //removedPendings: just storing the userID
                            if(!removedPendings.includes(pendingUser.uid)){
                                setRemovedPendings(removedPendings.concat([pendingUser.uid]));}

                            setPending(
                                pending.slice(0, index)
                                .concat(
                                    pending.slice(index+1)))
                        }}>

                            <Icon name="close" size={17} color="#333" style={{marginTop:2, marginLeft:3}}/>
                        </Pressable>

                    </View>
                ))}
                
                <Pressable 
                    style={styles.outlineButton} 
                    onPress={()=>{ navigation.navigate('Search User') }}>
                    <Text style={{}}>
                        + Add attendees
                    </Text>
                </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Dates</Text>
            
            <View id='propose_dates' style={[{marginBottom:30}]}>
                
                {times.map((date, index) => {
                    //console.log(times);
                    return (
                    <View style={[{marginBottom:10}]} key={index}> 

                        <DateRow 
                            date={dateToString(firebaseTimstampToDate(date.date))} 
                            index={index} 
                            times={times} 
                            setTimes={setTimes}>
                        </DateRow>
                        
                        {/* <Pressable onPress={()=>{
                            setTimes(
                                times.slice(0, index)
                                .concat(
                                    times.slice(index+1)));
                        }}>

                            <Icon name="close" size={17} color="#333" style={{marginTop:2, marginLeft:3}}/>
                        </Pressable> */}
                    <View style={styles.seperator}/>
                    </View>
                )})}

                <Pressable 
                    style={styles.outlineButton}
                    onPress={()=>{showDatepicker()}}
                >
                    <Text style={[]}>
                        + Propose new date
                    </Text>
                </Pressable>
            </View>

            <View style={{alignItems:'flex-start'}}>
                <Pressable 
                    style={[
                        styles.popButton, {
                        paddingHorizontal:20,
                        backgroundColor:'#0065FF'
                    }]}
                    onPress={()=>{handleSubmit()}}>
                    <Text style={{fontWeight:500,fontSize:15.5,color:'#eee'}}>Edit event</Text>
                </Pressable>
            </View>
            <View style={{height:100}}/>
        </ScrollView>
        </View>
    );
}