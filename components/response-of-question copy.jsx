import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants'; 

export const ResponseOfQuestion0 = ({text, active, onPress}) => { 
   return (
     <TouchableOpacity style={[styles.container, {backgroundColor: active ? COLORS.accent600 : null, borderColor: active ? COLORS.accent600 : null}]}
     onPress={onPress}       
     >
         <Text style={[styles.text, {color: active ? COLORS.neutral100 : null}]} >{text}</Text>
     </TouchableOpacity>
   );
 }

export const ResponseOfQuestion1 = ({text, active, onPress}) => {

  return (
    <TouchableOpacity style={[styles.container, {backgroundColor: active ? COLORS.accent600 : null, borderColor: active ? COLORS.accent600 : null}]}
    onPress={onPress}       
    >
        <Text style={[styles.text, {color: active ? COLORS.neutral100 : null}]} >{text}</Text>
    </TouchableOpacity>
  );
}
   
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVerticale: 5,
        borderRadius: 15,
        marginRight: 10
    },
    text: {
        fontFamily: "Regular", 
        fontSize: SIZES.small
    }
})

