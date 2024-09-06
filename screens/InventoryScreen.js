import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarCodeScanner } from 'expo-barcode-scanner';

const InventoryScreen = () => {
  const [itemName, setItemName] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [itemValue, setItemValue] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemExpiryDate, setItemExpiryDate] = useState('');
  const [inventory, setInventory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

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

    const requestCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    requestCameraPermission();
  }, []);

  const addItem = async () => {
    if (!itemName || !itemCode || !itemValue || !itemQuantity || !itemExpiryDate) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const newItem = {
      name: itemName,
      code: itemCode,
      value: parseFloat(itemValue) || 0,
      quantity: parseInt(itemQuantity, 10) || 0,
      expiryDate: itemExpiryDate,
    };

    console.log('Novo item:', newItem); // Log para verificar os valores

    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    setItemName('');
    setItemCode('');
    setItemValue('');
    setItemQuantity('');
    setItemExpiryDate('');

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

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setItemCode(data);
    setModalVisible(false);
    Alert.alert('Código de barras escaneado!', `Tipo: ${type}\nDados: ${data}`);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.item}>Nome: {item.name || 'Desconhecido'}</Text>
      <Text style={styles.item}>Código: {item.code || 'Não informado'}</Text>
      <Text style={styles.item}>Valor: R${(item.value || 0).toFixed(2)}</Text>
      <Text style={styles.item}>Quantidade: {item.quantity || 0}</Text>
      <Text style={styles.item}>Data de Validade: {item.expiryDate || 'Não informada'}</Text>
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

  if (hasPermission === null) {
    return <Text>Solicitando permissão para usar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

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
        placeholder="Código do item"
        value={itemCode}
        onChangeText={setItemCode}
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
      <TextInput
        style={styles.input}
        placeholder="Data de validade (DD/MM/AAAA)"
        value={itemExpiryDate}
        onChangeText={setItemExpiryDate}
      />
      <Button title="Adicionar Item" onPress={addItem} />
      <Button title="Escanear Código de Barras" onPress={() => setModalVisible(true)} />
      <Button title="Limpar Inventário" onPress={clearInventory} color="red" />
      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <Button title="Fechar" onPress={() => setModalVisible(false)} />
          {scanned && <Button title="Escanear Novamente" onPress={() => setScanned(false)} />}
        </View>
      </Modal>
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
    borderRadius: 20,
    marginTop: 10,
  },
  modalContainer: {
    width: "100%",
    height: "90%",
    justifyContent: 'flex-end',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomLeftRadius: 1,
    alignItems: 'center',
    marginTop: 1,
  },
});

export default InventoryScreen;
