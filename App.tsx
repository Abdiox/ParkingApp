import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Routes, Route } from 'react-router-dom';


import Login from './src/Security/Login';

export default function App() {
  return (
   <Routes>
    <Route path="/" element={<Login />} />
    
   </Routes>

  );
}


