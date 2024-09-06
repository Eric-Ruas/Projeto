import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [lowStockItems, setLowStockItems] = useState([]);

  // Função para carregar e ordenar os itens do inventário
  useEffect(() => {
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

    loadLowStockItems();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.item}>Nome: {item.name || 'Desconhecido'}</Text>
      <Text style={styles.item}>Quantidade: {item.quantity || 0}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque</Text>
      
      <Button
        title="Ver Estoque"
        onPress={() => navigation.navigate('Inventory')}
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
    fontSize: 34,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
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
});

export default HomeScreen;
