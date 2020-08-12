import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, Text } from 'react-native';

const Button = ({ text, color, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.buttonBox, { backgroundColor: color }]}
  >
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  buttonBox: {
    borderWidth: 1,
    height: 40,
    flex: 1,
    marginTop: 5,
    // marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Button;
