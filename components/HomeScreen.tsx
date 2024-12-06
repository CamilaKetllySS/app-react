import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { fetchAgents, Agent } from "../api/api";
import Icon from "react-native-vector-icons/Feather";
import * as Location from 'expo-location';  // Adicionando a biblioteca expo-location

const { height, width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [agentsPerPage] = useState<number>(1);
  const [totalAgents, setTotalAgents] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState<any>(null);
  const [mapModalVisible, setMapModalVisible] = useState(false); // Controle para o modal do mapa
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const loadAgents = async () => {
    const agentsData = await fetchAgents();
    setAgents(agentsData);
    setTotalAgents(agentsData.length);
  };

  const loadLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert("Permissão de localização não concedida.");
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  };

  const goToNextPage = () => {
    if (currentPage < totalAgents - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleAbilityClick = (ability: any) => {
    setSelectedAbility(ability);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedAbility(null);
  };

  // Função para abrir o modal de mapa
  const handleOpenMapModal = () => {
    setMapModalVisible(true);  // Abre o modal do mapa
  };

  const handleCloseMapModal = () => {
    setMapModalVisible(false);  // Fecha o modal do mapa
  };

  useEffect(() => {
    loadAgents();
    loadLocation(); // Carrega a localização quando a tela for carregada
  }, []);

  const currentAgent = agents[currentPage];

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#0f0f0f",
        padding: 16,
        marginTop: 34,
      }}
    >
      {currentAgent ? (
        <View
          style={{
            backgroundColor: "#1d1d1d",
            padding: 20,
            marginBottom: 30,
            marginHorizontal: 10,
            borderRadius: 16,
            height: height * 0.75,
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "40%",
              borderRadius: 16,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              source={{ uri: currentAgent.displayIcon }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                borderRadius: 16,
                opacity: 0.7,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderRadius: 16,
              }}
            />
          </View>

          <View
            style={{
              marginTop: 15,
              alignItems: "center",
              paddingHorizontal: 15,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {currentAgent.displayName}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#ccc",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {currentAgent.description}
            </Text>
            <View style={{ marginTop: 10, alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 5,
                }}
              >
                Função:
              </Text>
              <Text
                style={{
                  color: "#ffd700",
                  fontSize: 16,
                }}
              >
                {currentAgent.role?.displayName || "Desconhecida"}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
              paddingHorizontal: 15,
            }}
          >
            {currentAgent.abilities.map((ability, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAbilityClick(ability)}
              >
                <Image
                  source={{ uri: ability.displayIcon }}
                  style={{
                    width: 45,
                    height: 45,
                    marginHorizontal: 10,
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: 25,
              paddingHorizontal: 15,
            }}
          >
            <TouchableOpacity
              onPress={goToPreviousPage}
              disabled={currentPage === 0}
              style={{
                padding: 12,
                borderRadius: 50,
                backgroundColor: "#d32f2f",
              }}
            >
              <Icon
                name="chevron-left"
                size={60}
                color={currentPage === 0 ? "#ddd" : "#000"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goToNextPage}
              disabled={currentPage === totalAgents - 1}
              style={{
                padding: 12,
                borderRadius: 50,
                backgroundColor: "#d32f2f",
              }}
            >
              <Icon
                name="chevron-right"
                size={60}
                color={currentPage === totalAgents - 1 ? "#ddd" : "#000"}
              />
            </TouchableOpacity>
          </View>

          {/* Botão para abrir o modal do mapa */}
          <TouchableOpacity
            onPress={handleOpenMapModal}
            style={{
              marginTop: 20,
              padding: 12,
              borderRadius: 50,
              backgroundColor: "#d32f2f",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Ver Localização</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
          Carregando...
        </Text>
      )}

      {/* Modal for Ability */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
          >
            <View
              style={{
                width: width * 0.8,
                backgroundColor: "#1d1d1d",
                padding: 20,
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={handleCloseModal}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "#333",
                  borderRadius: 50,
                  padding: 10,
                }}
              >
                <Icon name="x" size={20} color="#fff" />
              </TouchableOpacity>

              {selectedAbility && (
                <>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#fff",
                      textAlign: "center",
                      marginBottom: 15,
                    }}
                  >
                    {selectedAbility.displayName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#ccc",
                      textAlign: "center",
                    }}
                  >
                    {selectedAbility.description}
                  </Text>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal do mapa */}
      <Modal
        transparent={true}
        visible={mapModalVisible}
        onRequestClose={handleCloseMapModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseMapModal}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
          >
            <View
              style={{
                width: width * 0.8,
                height: height * 0.5,
                backgroundColor: "#1d1d1d",
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={handleCloseMapModal}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "#333",
                  borderRadius: 50,
                  padding: 10,
                }}
              >
                <Icon name="x" size={20} color="#fff" />
              </TouchableOpacity>

              {location && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: "#fff", marginBottom: 10 }}>Sua Localização:</Text>
                  <Text style={{ color: "#fff" }}>
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default HomeScreen;