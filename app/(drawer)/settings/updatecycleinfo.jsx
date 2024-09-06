import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { COLORS, SIZES } from "@/constants";
import HeaderWithGoBack from "@/components/header-with-go-back";
import { useNavigation } from "expo-router";
import {
  preferenceState,
  userState,
  cycleMenstruelState,
} from "@/services/AmpelaStates";
import {
  deleteCycleById,
  addCycleMenstruel,
  getAllCycle,
  updateUserSqlite,
} from "@/services/database";
import { generateCycleMenstrualData } from "@/utils/menstruationUtils";
import { useSelector } from "@legendapp/state/react";

const UpdateCycleInfo = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(null);
  const user = useSelector(() => userState.get());
  const [cycleDuration, setCycleDuration] = useState("");
  const [periodDuration, setPeriodDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { theme } = preferenceState.get();

  const isDateSelected = !!selectedDate;

  const getFirstDayOfLastMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, 1);
  };

  const getLastDayOfLastMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 0);
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleUpdateCycleInfo = async () => {
    if (!selectedDate) {
      Alert.alert("Erreur", "Veuillez choisir une date");
      return;
    }

    if (!cycleDuration) {
      Alert.alert("Erreur", "Veuillez entrer la durée du cycle");
      return;
    }

    if (!periodDuration) {
      Alert.alert("Erreur", "Veuillez entrer la durée des règles");
      return;
    }

    if (parseInt(periodDuration) > 8) {
      Alert.alert("Erreur", "La durée des règles ne peut pas dépasser 8 jours");
      return;
    }

    if (parseInt(periodDuration) < 1) {
      Alert.alert("Erreur", "La durée des règles doit être d'au moins 1 jour");
      return;
    }

    setIsLoading(true);

    try {
      const allCycles = await getAllCycle();

      for (const cycle of allCycles) {
        const cycleStartDate = new Date(cycle.startMenstruationDate);
        const selectedDateObj = new Date(selectedDate);
        if (cycleStartDate >= selectedDateObj) {
          await deleteCycleById(cycle.id);
        }
      }

      const cycleDatas = generateCycleMenstrualData(
        selectedDate,
        cycleDuration,
        periodDuration
      );

      for (const cycle of cycleDatas) {
        await addCycleMenstruel(
          cycle.fecundityPeriodEnd,
          cycle.fecundityPeriodStart,
          cycle.month,
          cycle.startMenstruationDate,
          cycle.endMenstruationDate,
          cycle.nextMenstruationDate,
          cycle.nextMenstruationEndDate,
          cycle.ovulationDate,
          periodDuration,
          cycleDuration
        );

        setProgress(
          ((cycleDatas.indexOf(cycle) + 1) / cycleDatas.length) * 100
        );
      }

      const updatedUser = {
        ...user,
        lastMenstruationDate: selectedDate,
        durationMenstruation: periodDuration,
        cycleDuration: cycleDuration,
      };
      userState.set(updatedUser);

      await updateUserSqlite(
        user.id,
        user.username,
        user.password,
        user.profession,
        selectedDate,
        periodDuration,
        cycleDuration,
        user.email,
        user.profileImage
      );

      const updatedCycles = await getAllCycle();
      cycleMenstruelState.set({ cyclesData: updatedCycles });

      Alert.alert(
        "Succès",
        `Information du cycle mise à jour pour la date: ${selectedDate}\nDurée du cycle: ${cycleDuration}\nDurée des règles: ${periodDuration}`
      );
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour des informations du cycle."
      );
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: COLORS.bg100,
        },
      ]}
    >
      <HeaderWithGoBack title="Modification" navigation={navigation} />
      <ScrollView
        style={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description} className="mb-3">
          Choisissez une date du mois précédent pour mettre à jour l'information
          du cycle. Cette date sera le début des règles du dernier cycle.
        </Text>
        <Calendar
          onDayPress={handleDayPress}
          maxDate={new Date().toISOString().split("T")[0]}
          markedDates={{
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor:
                theme === "pink" ? COLORS.accent500 : COLORS.accent800,
            },
          }}
          style={{
            height: 380,
            borderRadius: 8,
          }}
          theme={{
            textSectio0nTitleColor: COLORS.neutral400,
            todayTextColor:
              theme === "pink" ? COLORS.accent500 : COLORS.accent800,
            dayTextColor: "#2d4150",
            textDisabledColor: COLORS.neutral400,
            arrowColor: COLORS.primary,
            monthTextColor: COLORS.primary,
            textDayFontFamily: "Regular",
            textMonthFontFamily: "SBold",
            textDayHeaderFontFamily: "Regular",
            textDayFontSize: SIZES.medium,
            textMonthFontSize: SIZES.large,
            textDayHeaderFontSize: SIZES.medium,
          }}
        />
        <View style={styles.inputContainer} className="mt-5">
          <Text className="my-3 " style={{ fontSize: 15 }}>
            Nouvelle durée des règles
          </Text>
          <TextInput
            style={[styles.input, !isDateSelected && styles.inputDisabled]}
            keyboardType="numeric"
            value={periodDuration}
            onChangeText={(text) => {
              const value = text.replace(/[^0-9]/g, "");
              const numValue = parseInt(value, 10);
              if (numValue >= 1 && numValue <= 8) {
                setPeriodDuration(value);
              } else if (value === "") {
                setPeriodDuration("");
              }
            }}
            placeholder={
              "Votre durée des règles actuel est " +
              user.durationMenstruation +
              " jours"
            }
            maxLength={1}
            editable={isDateSelected}
          />
        </View>
        <View style={styles.inputContainer} className="mt-2">
          <Text className="my-3 " style={{ fontSize: 15 }}>
            Nouvelle durée du cycle
          </Text>
          <TextInput
            style={[styles.input, !isDateSelected && styles.inputDisabled]}
            keyboardType="numeric"
            value={cycleDuration}
            onChangeText={(text) => {
              const value = text.replace(/[^0-9]/g, "");
              const numValue = parseInt(value, 10);
              if (numValue >= 1 && numValue <= 40) {
                setCycleDuration(value);
              } else if (value === "") {
                setCycleDuration("");
              }
            }}
            placeholder={
              "Votre durée du cycle est  actuel " +
              user.cycleDuration +
              " jours"
            }
            maxLength={2}
            editable={isDateSelected}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                !selectedDate || !cycleDuration || !periodDuration
                  ? theme === "pink"
                    ? COLORS.accent500_40
                    : COLORS.accent800_40
                  : theme === "pink"
                  ? COLORS.accent500
                  : COLORS.accent800,
            },
          ]}
          onPress={handleUpdateCycleInfo}
          disabled={!selectedDate || !cycleDuration || !periodDuration}
        >
          <Text style={styles.buttonText}>Mettre à jour</Text>
        </TouchableOpacity>
        <View className="h-[40]" />
      </ScrollView>
      <Modal transparent={true} visible={isLoading} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.modalText}>
              Chargement de vos données... {Math.round(progress)}%
            </Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${progress}%`,
                    backgroundColor:
                      theme === "pink" ? COLORS.accent500 : COLORS.accent800,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 20,
    marginTop: 120,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.bg200,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: COLORS.dark,
    borderWidth: 1,
    borderColor: "#c0bdbd",
  },
  inputDisabled: {
    // backgroundColor: COLORS.lightGrey,
  },
  button: {
    backgroundColor: COLORS.accent500,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#e7e5e5",
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.neutral100,
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginVertical: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#e7e5e5",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 10,
  },
  progressBar: {
    height: "100%",

    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default UpdateCycleInfo;
