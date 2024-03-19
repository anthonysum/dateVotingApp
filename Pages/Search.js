import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { collection, query, where, getDocs, or } from "firebase/firestore";
import {db} from '../ContextAndConfig/firebaseConfig.js';
import { UserContext } from '../ContextAndConfig/UserContext.js';

import importStyle from '../style.js'

function Screen({ navigation, 
  attenders, setAttenders, 
  organizers, setorganizers
}) {
  
  const insets = useSafeAreaInsets();
  const [searchMethod,setSearchMethod] = useState('email');
  const [userQuery,setUserQuery] = useState('');
  const [queryResult,setqueryResult] = useState([]);

  const fetchUsers = async () => {
    if(userQuery){
      const q = query(collection(db, "users"),
        where(searchMethod, ">=" , userQuery.trim()),
        where(searchMethod, "<=" , userQuery.trim() + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      setqueryResult(querySnapshot.docs);
    }
    else{setqueryResult([]);}
    return () => {};
  }

  useEffect(()=>{
    fetchUsers().catch(
      (e)=>{console.log(e)});    
  },[userQuery,searchMethod]);

  const attenderIDs = attenders.map((x)=> x.uid);

  return (
    <View id="safe_area_with_header" style={{
      height:'100%', width:'100%',
      paddingLeft: insets.left, paddingRight: insets.right
    }}>
      <View style={{
            paddingTop: 18,
            paddingBottom: 0,
            paddingLeft: 18,
            paddingRight: 18
      }}>

        <View style={[importStyle.inputBox,{marginBottom:18}]}>
          <TextInput 
            value={userQuery} 
            onChangeText={(value)=>{setUserQuery(value)}}
            style={{fontSize:15}}
            placeholder='Search for users...'
          />
        </View>

        <View style={{flexDirection:'row', marginBottom:10}}>   

          <Pressable style={[
              importStyle.outlineButton, 
              searchMethod == 'email' && {backgroundColor: '#e6e6e6'}]} 
            onPress={()=>{setSearchMethod('email')}}>
            <Text style={{}}> By email </Text>
          </Pressable>

          <Pressable style={[
            importStyle.outlineButton,
            searchMethod == 'user' && {backgroundColor: '#e6e6e6'}]}  
            onPress={()=>{setSearchMethod('user')}}>
            <Text style={{}}> By name </Text>
          </Pressable>

        </View>

        {queryResult?.map((doc, index) => (
          <Pressable 
            style={[importStyle.searchResult]} 
            key={index}
            disabled={attenderIDs.includes(doc.id)}
            onPress={()=>{
              setAttenders(attenders.concat([{
                name: doc.data().user,
                email: doc.data().email,
                uid: doc.id
              }]));
              navigation.goBack();
          }}>
            <Text style={[{fontSize:20 , fontWeight:'500', marginBottom:2 },
              attenderIDs.includes(doc.id) ? {color:'#777'} : {color:'#333'}]}>
                {doc.data().user}
            </Text>
            <Text style={{color:'#777'}}>{attenderIDs.includes(doc.id) ? "User already added" : doc.data().email}</Text>
          </Pressable>
        ))}

      </View>
    </View>
  );
}

export default Screen;