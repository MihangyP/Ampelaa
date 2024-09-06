import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import {SIZES, COLORS} from "@/constants"; 

const CommentItem = ({ authorPic, authorName, creationDate, content }) => {
    return (
        <View style={{ marginVertical: 10 }}>
            <View style={styles.header}>
                <View style={styles.header}>
                    <Image source={authorPic} style={styles.img} />
                    <View>
                        <Text style={{fontFamily: "SBold"}}>{authorName}</Text>
                        <Text style={[styles.txt, {fontSize: SIZES.small} ]}>{creationDate}</Text>
                    </View>
                </View>
            </View>
            <View>
                <Text style={styles.content}>{content}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        gap: 5
    },
    img: {
        width: 24,
        height: 24,
        borderRadius: 100,
    },
    txt: {
        fontFamily: "Regular"
    },
    content: {
        color: COLORS.primary,
        fontFamily: "Regular",
        marginVertical: 5,
        fontSize: SIZES.medium
    }
});

export default CommentItem;
