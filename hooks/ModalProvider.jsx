import React, { createContext, useContext, useRef, useState } from "react";

import { StyleSheet, Modal, View } from "react-native";
import { COLORS, SIZES } from "@/constants";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState(null);

  const openModal = (component) => {
    setContent(component);
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        visible={isVisible}
        ref={modalRef}
        animationType="slide"
        transparent={true}
        hardwareAccelerated={true}
        onRequestClose={closeModal}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            height: SIZES.height,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          {content}
        </View>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
