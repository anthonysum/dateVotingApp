import * as React from 'react';
import { useContext } from 'react';
import {View, Text, Image} from 'react-native';
import {DrawerItemList } from '@react-navigation/drawer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import { UserContext } from '../ContextAndConfig/UserContext';
import default_avatar from '../assets/default_avatar.png';

import styles from '../style.js';

function Drawer( props ) {

    const user = useContext(UserContext);
    const insets = useSafeAreaInsets();

    return(
            <View style={{paddingTop: insets.top, height:'100%'}}>
                <DrawerItemList {...props} />
                <View style={{flex:1}}></View>
                <View style={{flexDirection:'row', paddingStart:20, paddingBottom:30, alignItems:'center'}}>
                    <Image source={default_avatar} style={styles.avatar}></Image>
                    <Text style={{paddingLeft:12,fontSize:15, flex:1}} >{user ? user.user:''}</Text>
                </View>
            </View>
    );
}

export default Drawer;