import * as React from 'react';
import { useState, useContext } from 'react';
import {View, Text, Button, TextInput, StyleSheet, Pressable } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PendingBox from '../Component/PendingBox';
import { ScrollView } from 'react-native-gesture-handler';
import { UserContext } from '../ContextAndConfig/UserContext';

export default function Screen({ navigation, type }) {

    const insets = useSafeAreaInsets();

    const user = useContext(UserContext)

    return(
        <View id="safe_area_with_header" style={{
            height:'100%', width:'100%',
            paddingLeft: insets.left, paddingRight: insets.right
        }}>
            <ScrollView>
                {user.pending.map((pendinEvent, index) => (
                    <View key={index}>
                        <PendingBox eventID={pendinEvent.eventID} invite={pendinEvent.invite}/>
                        <View style={styles.seperator}/>
                    </View>
                ))
                }
            </ScrollView>
        </View>
    );
}