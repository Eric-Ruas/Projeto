import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InventoryScreen = () => {
  const [itemName, setItemName] = useState('');
  const [itemValue, setItemValue] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const storedInventory = await AsyncStorage.getItem('inventory');
        if (storedInventory) {
          setInventory(JSON.parse(storedInventory));
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os itens do estoque.');
      }
    };

    loadInventory();
  }, []);

  const addItem = async () => {
    if (!itemName || !itemValue || !itemQuantity) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const newItem = {
      name: itemName,
      value: parseFloat(itemValue) || 0, // Garantir que o valor seja um número
      quantity: parseInt(itemQuantity, 10) || 0, // Garantir que a quantidade seja um número
    };

    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    setItemName('');
    setItemValue('');
    setItemQuantity('');

    try {
      await AsyncStorage.setItem('inventory', JSON.stringify(updatedInventory));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o item.');
    }
  };

  const updateItemQuantity = async (index, quantityChange) => {
    const updatedInventory = [...inventory];
    const currentItem = updatedInventory[index];

    if (currentItem.quantity + quantityChange < 0) {
      Alert.alert('Erro', 'Quantidade não pode ser negativa.');
      return;
    }

    updatedInventory[index].quantity += quantityChange;
    setInventory(updatedInventory);

    try {
      await AsyncStorage.setItem('inventory', JSON.stringify(updatedInventory));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o estoque.');
    }
  };

  const clearInventory = async () => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja limpar o inventário? Isso irá apagar tudo!!!!!',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('inventory');
              setInventory([]);
              Alert.alert('Sucesso', 'Inventário limpo com sucesso.');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar o inventário.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.item}>Nome: {item.name || 'Desconhecido'}</Text>
      <Text style={styles.item}>Valor: R${(item.value || 0).toFixed(2)}</Text>
      <Text style={styles.item}>Quantidade: {item.quantity || 0}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Entrada"
          onPress={() => updateItemQuantity(index, 1)}
        />
        <Button
          title="Saída"
          onPress={() => updateItemQuantity(index, -1)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventário</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do item"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor do item"
        value={itemValue}
        keyboardType="numeric"
        onChangeText={setItemValue}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade do item"
        value={itemQuantity}
        keyboardType="numeric"
        onChangeText={setItemQuantity}
      />
      <Button title="Adicionar Item" onPress={addItem} />
      <Button title="Limpar Inventário" onPress={clearInventory} color="red" />
      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  item: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default InventoryScreen;
