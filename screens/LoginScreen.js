import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground } from 'react-native';

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
    // ImageBackground como plano de fundo
    <ImageBackground 
      source={require('./images/Background.png')} 
      style={styles.background}
      imageStyle={{ resizeMode: 'cover' }}
    >
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Ocupa todo o espaço disponível
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%', // Definir a largura máxima do conteúdo para não ocupar toda a tela
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo transparente para destacar os campos
    borderRadius: 10, // Bordas arredondadas para o container
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%', // Faz o input ocupar toda a largura do container
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});

export default LoginScreen;
