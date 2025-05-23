import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddPetScreen = ({ navigation }) => {
  const [selections, setSelections] = useState({});

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
          <Text style={styles.headerTitle}>Agregar Mascota</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Subir Foto */}
          <View style={styles.photoContainer}>
            <TouchableOpacity
              style={styles.uploadPhoto}
              onPress={() => console.log("Abrir galería")} // Aquí irá la función para abrir la galería
            >
              <Ionicons name="camera" size={40} color="#007aff" />
              <Text style={styles.uploadText}>Subir Foto</Text>
            </TouchableOpacity>
          </View>

          {/* Tipo */}
          <Text style={styles.sectionLabel}>Tipo</Text>
          <View style={styles.inlineOptions}>
            {["Perro", "Gato"].map((opcion) => (
              <TouchableOpacity
                key={opcion}
                style={[
                  styles.optionButton,
                  selections.tipo === opcion && styles.selectedOption,
                ]}
                onPress={() => setSelections({ ...selections, tipo: opcion })}
              >
                <Text
                  style={[
                    styles.optionText,
                    selections.tipo === opcion && styles.selectedText,
                  ]}
                >
                  {opcion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Nombre */}
          <Text style={styles.sectionLabel}>Nombre</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe aquí"
            placeholderTextColor="#999"
          />

          {/* Género */}
          <Text style={styles.sectionLabel}>Género</Text>
          <View style={styles.inlineOptions}>
            {["Macho", "Hembra"].map((opcion) => (
              <TouchableOpacity
                key={opcion}
                style={[
                  styles.optionButton,
                  selections.genero === opcion && styles.selectedOption,
                ]}
                onPress={() => setSelections({ ...selections, genero: opcion })}
              >
                <Text
                  style={[
                    styles.optionText,
                    selections.genero === opcion && styles.selectedText,
                  ]}
                >
                  {opcion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Raza */}
          <Text style={styles.sectionLabel}>Raza</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Selecciona una raza</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          {/* Tamaño */}
          <Text style={styles.sectionLabel}>Tamaño</Text>
          <View style={styles.inlineOptions}>
            {["Pequeño", "Mediano", "Grande"].map((opcion) => (
              <TouchableOpacity
                key={opcion}
                style={[
                  styles.optionButton,
                  selections.tamaño === opcion && styles.selectedOption,
                ]}
                onPress={() => setSelections({ ...selections, tamaño: opcion })}
              >
                <Text
                  style={[
                    styles.optionText,
                    selections.tamaño === opcion && styles.selectedText,
                  ]}
                >
                  {opcion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Edad */}
          <Text style={styles.sectionLabel}>Edad</Text>
          <View style={styles.ageContainer}>
            <TextInput
              style={styles.ageInput}
              keyboardType="numeric"
              placeholder="0"
            />
            <View style={styles.ageUnitContainer}>
              {["Año(s)", "Meses"].map((opcion) => (
                <TouchableOpacity
                  key={opcion}
                  style={[
                    styles.ageUnitButton,
                    selections.unidadEdad === opcion && styles.selectedAgeUnit,
                  ]}
                  onPress={() =>
                    setSelections({ ...selections, unidadEdad: opcion })
                  }
                >
                  <Text
                    style={[
                      styles.ageUnitText,
                      selections.unidadEdad === opcion &&
                        styles.selectedAgeUnitText,
                    ]}
                  >
                    {opcion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Botones Inferiores */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
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
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 5,
  },
  photoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    color: "#666",
    fontSize: 16,
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 15,
    width: "48%",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#007aff",
    borderRadius: 20,
    padding: 15,
    width: "48%",
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});

export default AddPetScreen;
