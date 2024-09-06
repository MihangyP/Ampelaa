import { useContext } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { SIZES, COLORS } from "@/constants"; 
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";
// import { ThemeContext } from "@/theme-context";

export const StateItem1 = ({ text, active, urlImg, onPress }) => {
    // const {theme} = useContext(ThemeContext);
    const { theme, language } = useSelector(() => preferenceState.get()); 
    return ( 
    <View style={styles.container}>
      <Pressable
        style={[styles.containerImg, {backgroundColor: active ? COLORS.accent400 : COLORS.neutral100}]}
        onPress={onPress}
      >
        <Image source={urlImg} style={styles.img} />
      </Pressable>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export const StateItem2 = ({ text, urlImg, active, onPress }) => {
    const { theme, language } = useSelector(() => preferenceState.get());
  
    return (
        <View style={styles.container}>
            <Pressable  style={[styles.containerImg, {backgroundColor: active ? COLORS.accent400 : COLORS.neutral100}]} onPress={onPress} >
                <Image source={urlImg} style={styles.img} />
            </Pressable>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

export const StateItem3 = ({ text, urlImg, active, onPress }) => {
    const { theme, language } = useSelector(() => preferenceState.get());
   
    return (
        <View style={styles.container}>
            <Pressable  style={[styles.containerImg, {backgroundColor: active ? COLORS.accent400 : COLORS.neutral100}]} onPress={onPress}>
                <Image source={urlImg} style={styles.img} />
            </Pressable>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center", 
        gap: 6, 
        marginRight: 35
    },
    containerImg: {
        padding: 15,
        borderRadius: 100,
    },
    img: {
        width: 42, 
        height: 42
    },
    text: {
        fontFamily: "Regular",
        fontSize: SIZES.small
    }
})

