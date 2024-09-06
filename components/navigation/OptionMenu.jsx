import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  useWindowDimensions,
  Animated,
  Easing,
  findNodeHandle,
  UIManager,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MenuButton = ({ menuItems }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;
  const buttonRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(animation, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleLayout = () => {
    const handle = findNodeHandle(buttonRef.current);
    if (handle) {
      UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        setButtonLayout({ x: pageX, y: pageY, width, height });
      });
    }
  };

  useEffect(() => {
    if (buttonRef.current) {
      handleLayout();
    }
  }, [buttonRef.current]);

  const calculateModalPosition = () => {
    if (!buttonLayout) return {};

    const modalWidth = 200;
    const modalHeight = 150;
    let top = buttonLayout.y + buttonLayout.height;
    let left = buttonLayout.x;

    // Adjust for modal being too far right
    if (buttonLayout.x + modalWidth > width) {
      left = width - modalWidth - 10;
    }

    // Adjust for modal being too far down
    if (buttonLayout.y + modalHeight > height) {
      top = buttonLayout.y - modalHeight;
    }

    return { top, left };
  };

  const modalStyle = {
    ...styles.modalContainer,
    ...calculateModalPosition(),
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        closeModal();
        item.action();
      }}
      style={styles.option}
    >
      <Text style={styles.optionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={openModal}
        onLayout={handleLayout}
        ref={buttonRef}
        style={styles.buttonContainer}
        className="space-y-1 "
      >
        <View className="h-[4] w-[4] bg-white rounded-full" />
        <View className="h-[4] w-[4] bg-white rounded-full" />
        <View className="h-[4] w-[4] bg-white rounded-full" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalBackground} onPress={closeModal}>
          <Animated.View style={modalStyle}>
            <FlatList
              data={menuItems}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => (
                <View className="bg-gray-200 h-[1px]" />
              )}
            />
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonContainer: { padding: 10, width: 20, justifyContent: "flex-end" },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 10,
    width: 200,
    elevation: 1,
  },
  option: {
    padding: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
  },
});

export default MenuButton;
