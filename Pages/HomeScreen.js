import * as React from 'react';
import { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { signOut } from 'firebase/auth';

import { auth } from '../ContextAndConfig/firebaseConfig.js';
import { UserContext } from '../ContextAndConfig/UserContext.js';
import importStyle from '../style.js';

function HomeScreen({ navigation }) {
  
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const user = useContext(UserContext);

  React.useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerStyle: {backgroundColor:'transparent'},
      headerBackVisible: false
    });
  });

  return (
    <View>
      <View id="full_screen" style={{height:'100%', width:'100%'}}>
        <View id="top_area" style={{
            paddingTop: headerHeight + 3,
            paddingBottom: 18,
            paddingLeft: insets.left + 18,
            paddingRight: insets.right + 18,
            backgroundColor:"#ddd",
            height:"40%"
        }}>

          <View id="top_card" style={[importStyle.card, {flex:1}]}>
          </View>

        </View>
        <View id="bottom_area" style={{
            paddingTop: 18,
            paddingBottom: 0,
            paddingLeft: insets.left + 18,
            paddingRight: insets.right+ 18
        }}>
            <Button title={'Sign Out ' + (user ? user.user:'')}
              onPress={()=>{
                try{
                  signOut(auth);
                }
                catch(err){
                  console.log(err.message);
                }
            }}/>
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;