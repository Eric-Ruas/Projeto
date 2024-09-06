import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Lista de usuários e suas credenciais
  const users = [
    { username: 'Admin', password: '1234' },
    { username: 'Jessy', password: '2801' },
    { username: 'Ruas', password: '1404' },
    { username: 'Repositor', password: '1111' },
    { username: 'Gerente', password: '2222' },
  ];

  const handleLogin = () => {
    // Verifica se o usuário e senha existem na lista de usuários
    const userFound = users.find(
      (user) => user.username === username && user.password === password
    );

    if (userFound) {
      navigation.replace('Home'); // Navega para a tela Home após login bem-sucedido
    } else {
      Alert.alert('Erro', 'Usuário ou senha inválidos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
});

export default LoginScreen;
