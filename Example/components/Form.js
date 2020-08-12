import React from 'react';
import { StyleSheet, View } from 'react-native';

const Form = props => <View style={styles.form} {...props} />;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    marginBottom:70,
    borderColor:"teal"


  },
});

export default Form;
