import * as React from 'react';
import { useState, useContext } from 'react';
import {View, Text, Button, TextInput, StyleSheet, Pressable } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { createUserWithEmailAndPassword ,AuthErrorCodes, signInWithEmailAndPassword } from 'firebase/auth';

import {
    SafeAreaProvider,
    useSafeAreaInsets,
  } from 'react-native-safe-area-context';
import { doc, setDoc } from 'firebase/firestore';

import {auth, db, users} from '../ContextAndConfig/firebaseConfig.js'
import styles from '../style.js'

function RegisterScreen({ navigation, type }) {

  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focus, setFocus] = useState('');
  const [errMessage, setErrMessage] = useState(['','']);

  const handleSubmit = async()=>{
    //console.log(email,password);
    if (email && password && (type == 'Login' || name.trim())){
      try{
        if(type == 'Register' ){
          await createUserWithEmailAndPassword(auth, email, password)
          .then((e)=>{
            setDoc(doc(users, e.user.uid), {
              uid: e.user.uid,
              user: name.trim(),
              email: email,
              events: [],
              organize:[],
              pending:[]
            }).catch((e)=>{console.log(e)})
          });
        }
        if(type == 'Login' ){
          await signInWithEmailAndPassword(auth, email, password);
        }
      }catch(err){
        console.log(err.code);
        switch(err.code){
          case(AuthErrorCodes.EMAIL_EXISTS): {
            setErrMessage(['email','Email already in use']);
            break;
          }
          case(AuthErrorCodes.INVALID_EMAIL): {
            setErrMessage(['email','Invail email']);
            break;
          }
          case(AuthErrorCodes.WEAK_PASSWORD): {
            setErrMessage(['pass', 'Password shold be at least 6 charaters']);
            break;
          }
          case(AuthErrorCodes.INVALID_LOGIN_CREDENTIALS): {
            setErrMessage(['pass', 'Invalid credential']);
            break;
          }
          default: {
            setErrMessage(['pass', 'Unknown error']);
            break;
          }
        }
      }
    }
  }

  function onFocus(arg) {
    setFocus(arg);
  }

  function onBlur() {
    setFocus('');
  }

  return (
    <View>
      <View id="full_screen" style={{height:'100%', width:'100%'}}>
        <View id="top_area" style={{
            paddingTop: headerHeight + 3,
            paddingBottom: 18,
            paddingLeft: insets.left + 18,
            paddingRight: insets.right + 18,
            backgroundColor:"#ddd",
            height:"35%"
        }}>
        </View>

        <View id='lower_area' style={{
          paddingTop: 35,
          paddingLeft: insets.left + 40,
          paddingRight: insets.right + 40
          }}>

          <Text id='title' style={{
            fontSize: 30,
            fontWeight: 700
            }}>
            {type}
          </Text>

          <View id='blank_1' style={{height:30}}/>

          {type == 'Register' ? 
            <View id='name_input' style={{height:70}}>
              <TextInput 
                value={name} 
                onChangeText={(value)=>{setName(value)}}
                style={[
                  styles.input, 
                  (focus == 'name' ? styles.focused : ''),
                  (errMessage[0] == 'name' ? styles.redBorder:'')
                ]}
                placeholder=' Name'
                onFocus={() => onFocus('name')}
                onBlur={() => onBlur()}
              />

              {errMessage[0] == 'email' ? 
              <Text style={styles.redText}>
                {errMessage[1]}
              </Text> : <></>}
            </View>
          :<></>}

          <View id='email_input' style={{height:70}}>
            <TextInput 
              value={email} 
              onChangeText={(value)=>{setEmail(value)}}
              style={[
                styles.input, 
                (focus == 'email' ? styles.focused : ''),
                (errMessage[0] == 'email' ? styles.redBorder:'')
              ]}
              placeholder=' Email'
              inputMode= 'email'
              onFocus={() => onFocus('email')}
              onBlur={() => onBlur()}
            />

            {errMessage[0] == 'email' ? 
            <Text style={styles.redText}>
              {errMessage[1]}
            </Text> : <></>}
          </View>

          <View id='pass_input' style={{height:30}}>
            <TextInput 
              value={password} 
              onChangeText={(value)=>{setPassword(value)}}
              style={[
                styles.input, 
                (focus == 'pass' ? styles.focused : ''), 
                (errMessage[0] == 'pass' ? styles.redBorder:'')
              ]}
              placeholder=' Password'
              secureTextEntry={true}
              onFocus={() => onFocus('pass')}
              onBlur={() => onBlur()}
            />

            {errMessage[0] == 'pass' ? 
            <Text style={styles.redText}>
              {errMessage[1]}
            </Text> : <></>}
          </View>

          <Pressable id='enter'
            onPress={handleSubmit}
            style={[
              styles.outlineButton,
              {alignSelf:'flex-start',
              marginTop: 25,
              marginLeft: 1,}
          ]}>
            <Text
              style={styles.outlineButtonTextL}>
              {type}
            </Text>
          </Pressable>

          <Pressable id='anotherPage'
            onPress={()=>{navigation.navigate(type == 'Register' ?  'Login' : 'Register')}}
            style={{
              marginTop: 40,
              marginLeft: 1,
              borderBottomWidth: 1,
              padding:1,
              borderBottomColor: '#6389c9',
              width: type == 'Register' ? 42 : 61,
              alignSelf:'flex-end'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color:'#6389c9'
            }}>
              {type == 'Register' ? 'Login' : 'Register'}
            </Text>
          </Pressable>
          
        </View>
      </View>
    </View>
  );
}

export default RegisterScreen;