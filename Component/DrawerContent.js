import * as React from 'react';
import { useContext } from 'react';
import {View, Text} from 'react-native';
import {DrawerItemList } from '@react-navigation/drawer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import { UserContext } from '../ContextAndConfig/UserContext';

function Drawer( props ) {

    const user = useContext(UserContext);
    const insets = useSafeAreaInsets();

    return(
            <View style={{paddingTop: insets.top, height:'100%'}}>
                <DrawerItemList {...props} />
                <View style={{flex:1}}></View>
                <Text style={{paddingBottom:30,paddingLeft:30,fontSize:15}} >{user ? user.user:''}</Text>
            </View>
    );
}

export default Drawer;