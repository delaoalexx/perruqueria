import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updatePet, deletePet } from "../services/petsService";

const PetDetailsScreen = ({ route, navigation }) => {
  const { pet } = route.params;

  const [photo, setPhoto] = useState(pet.picUrl || "");
  const [tamaño, setTamaño] = useState(pet.size || pet.tamaño || "");
  const [edad, setEdad] = useState(pet.age?.number?.toString() || "");
  const [unidadEdad, setUnidadEdad] = useState(
    pet.age?.unit === "años" ? "Año(s)" : "Meses"
  );
  // Estados para peso
  const [peso, setPeso] = useState(pet.weight?.number?.toString() || "");
  const [unidadPeso, setUnidadPeso] = useState(
    pet.weight?.unit === "kg" || pet.weight?.unit === "g"
      ? pet.weight.unit
      : "kg"
  );
  const [loading, setLoading] = useState(false);

  // Cambiar foto
  const handleChangePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Eliminar foto
  const handleDeletePhoto = () => {
    setPhoto("");
  };

  // Guardar cambios
  const handleSave = async () => {
    setLoading(true);
    try {
      await updatePet(pet.id, {
        picUrl: photo,
        size: tamaño,
        age: {
          number: Number(edad),
          unit: unidadEdad.toLowerCase() === "año(s)" ? "años" : "meses",
        },
        weight: {
          number: Number(peso),
          unit: unidadPeso,
        },
      });
      Alert.alert("Éxito", "Datos actualizados");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la mascota");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar mascota
  const handleDeletePet = async () => {
    Alert.alert(
      "Eliminar Mascota",
      "¿Seguro que deseas eliminar esta mascota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deletePet(pet.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles Mascota</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#007aff" />
            ) : (
              <Ionicons name="checkmark" size={24} color="#007aff" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Foto de la mascota */}
          <View style={styles.photoContainer}>
            <TouchableOpacity onPress={handleChangePhoto}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.petPhoto} />
              ) : (
                <View style={styles.uploadPhoto}>
                  <Ionicons name="camera" size={40} color="#007aff" />
                  <Text style={styles.uploadText}>Subir Foto</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.photoActions}>
              <TouchableOpacity
                onPress={handleChangePhoto}
                style={styles.iconBtn}
              >
                <Ionicons name="create-outline" size={22} color="#007aff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeletePhoto}
                style={styles.iconBtn}
              >
                <Ionicons name="trash-outline" size={22} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tipo - Solo lectura */}
          <Text style={styles.sectionLabel}>Tipo</Text>
          <View style={styles.inlineOptions}>
            {["Perro", "Gato"].map((opcion) => (
              <View
                key={opcion}
                style={[
                  styles.optionButton,
                  styles.disabledOption,
                  (pet.type === "Dog" && opcion === "Perro") ||
                  (pet.type === "Cat" && opcion === "Gato")
                    ? styles.selectedOption
                    : null,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    styles.disabledText,
                    (pet.type === "Dog" && opcion === "Perro") ||
                    (pet.type === "Cat" && opcion === "Gato")
                      ? styles.selectedText
                      : null,
                  ]}
                >
                  {opcion}
                </Text>
              </View>
            ))}
          </View>

          {/* Nombre - Solo lectura */}
          <Text style={styles.sectionLabel}>Nombre</Text>
          <TextInput
            style={[styles.textInput, styles.disabledInput]}
            value={pet.name}
            editable={false}
            placeholder="Nombre"
          />

          {/* Género - Solo lectura */}
          <Text style={styles.sectionLabel}>Género</Text>
          <View style={styles.inlineOptions}>
            {["Macho", "Hembra"].map((opcion) => (
              <View
                key={opcion}
                style={[
                  styles.optionButton,
                  styles.disabledOption,
                  (pet.gender === "Male" && opcion === "Macho") ||
                  (pet.gender === "Female" && opcion === "Hembra")
                    ? styles.selectedOption
                    : null,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    styles.disabledText,
                    (pet.gender === "Male" && opcion === "Macho") ||
                    (pet.gender === "Female" && opcion === "Hembra")
                      ? styles.selectedText
                      : null,
                  ]}
                >
                  {opcion}
                </Text>
              </View>
            ))}
          </View>

          {/* Raza - Solo lectura */}
          <Text style={styles.sectionLabel}>Raza</Text>
          <TextInput
            style={[styles.textInput, styles.disabledInput]}
            value={pet.breed}
            editable={false}
            placeholder="Raza"
          />

          {/* Tamaño - Editable */}
          <Text style={styles.sectionLabel}>Tamaño</Text>
          <View style={styles.inlineOptions}>
            {["Pequeño", "Mediano", "Grande"].map((opcion) => (
              <TouchableOpacity
                key={opcion}
                style={[
                  styles.optionButton,
                  tamaño === opcion && styles.selectedOption,
                ]}
                onPress={() => setTamaño(opcion)}
              >
                <Text
                  style={[
                    styles.optionText,
                    tamaño === opcion && styles.selectedText,
                  ]}
                >
                  {opcion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Peso - Editable */}
          <Text style={styles.sectionLabel}>Peso</Text>
          <View style={styles.ageContainer}>
            <TextInput
              style={styles.ageInput}
              keyboardType="numeric"
              placeholder="0"
              value={peso}
              onChangeText={setPeso}
            />
            <View style={styles.ageUnitContainer}>
              {["kg", "g"].map((opcion) => (
                <TouchableOpacity
                  key={opcion}
                  style={[
                    styles.ageUnitButton,
                    unidadPeso === opcion && styles.selectedAgeUnit,
                  ]}
                  onPress={() => setUnidadPeso(opcion)}
                >
                  <Text
                    style={[
                      styles.ageUnitText,
                      unidadPeso === opcion && styles.selectedAgeUnitText,
                    ]}
                  >
                    {opcion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Edad - Editable */}
          <Text style={styles.sectionLabel}>Edad</Text>
          <View style={styles.ageContainer}>
            <TextInput
              style={styles.ageInput}
              keyboardType="numeric"
              placeholder="0"
              value={edad}
              onChangeText={setEdad}
            />
            <View style={styles.ageUnitContainer}>
              {["Año(s)", "Meses"].map((opcion) => (
                <TouchableOpacity
                  key={opcion}
                  style={[
                    styles.ageUnitButton,
                    unidadEdad === opcion && styles.selectedAgeUnit,
                  ]}
                  onPress={() => setUnidadEdad(opcion)}
                >
                  <Text
                    style={[
                      styles.ageUnitText,
                      unidadEdad === opcion && styles.selectedAgeUnitText,
                    ]}
                  >
                    {opcion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Botón de eliminar mascota */}
        <TouchableOpacity
          style={styles.deleteFullButton}
          onPress={handleDeletePet}
        >
          <Text style={styles.deleteFullButtonText}>Eliminar Mascota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
    marginRight: 34,
  },
  saveButton: {
    padding: 5,
  },
  scrollContent: {
    paddingBottom: 5,
  },
  photoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  petPhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#eee",
  },
  uploadPhoto: {
    backgroundColor: "#fff",
    borderRadius: 70,
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#007aff",
    borderStyle: "dashed",
  },
  uploadText: {
    color: "#007aff",
    marginTop: 10,
    fontSize: 16,
  },
  photoActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  iconBtn: {
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    marginLeft: 5,
  },
  inlineOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: -5,
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#007aff",
  },
  optionText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
  selectedText: {
    color: "#fff",
  },
  textInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#f8f8f8",
    color: "#666",
  },
  disabledOption: {
    opacity: 0.6,
  },
  disabledText: {
    color: "#999",
  },
  ageContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  ageInput: {
    width: 80,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
    textAlign: "center",
  },
  ageUnitContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    overflow: "hidden",
    height: 45,
  },
  ageUnitButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  selectedAgeUnit: {
    backgroundColor: "#007aff",
  },
  ageUnitText: {
    color: "#666",
    fontSize: 16,
  },
  selectedAgeUnitText: {
    color: "#fff",
  },
  deleteFullButton: {
    backgroundColor: "#fff0f0",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  deleteFullButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e74c3c",
  },
});

export default PetDetailsScreen;
