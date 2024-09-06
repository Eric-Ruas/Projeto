import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [lowStockItems, setLowStockItems] = useState([]);

  // Função para carregar e ordenar os itens do inventário
  const loadLowStockItems = async () => {
    try {
      const storedInventory = await AsyncStorage.getItem('inventory');
      if (storedInventory) {
        const inventory = JSON.parse(storedInventory);
        
        // Ordena os itens pela quantidade
        const sortedInventory = inventory.sort((a, b) => a.quantity - b.quantity);
        
        // Pega os 5 itens com menor quantidade
        const topFiveLowStockItems = sortedInventory.slice(0, 5);
        setLowStockItems(topFiveLowStockItems);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os itens do estoque.');
    }
  };

  // Carrega os itens com menor estoque na inicialização
  useEffect(() => {
    loadLowStockItems();
  }, []);

  const handleRefresh = () => {
    loadLowStockItems(); // Atualiza a lista ao clicar no botão
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.item}>Nome: {item.name || 'Desconhecido'}</Text>
      <Text style={styles.item}>Quantidade: {item.quantity || 0}</Text>
      <Text style={styles.item}>Data de Validade: {item.expiryDate || 'Não informada'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque</Text>
      
      {/* Adicionando imagem local */}
      <Image source={require('./images/MFMERCADINHO.png')} style={styles.image} />

      <Button
        title="Ver Estoque"
        onPress={() => navigation.navigate('Inventory')}
      />
      
      <Button
        title="Atualizar Estoque Baixo"
        onPress={handleRefresh}
        color="green"
      />

      <Text style={styles.subtitle}>5 PRODUTOS COM MENOS ESTOQUE:</Text>
      <FlatList
        data={lowStockItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: 'red',
  },
  itemContainer: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  item: {
    fontSize: 18,
  },
  image: {
    width: 150, // Largura da imagem
    height: 150, // Altura da imagem
    marginBottom: 20, // Margem inferior para separar da lista
  },
});

export default HomeScreen;
