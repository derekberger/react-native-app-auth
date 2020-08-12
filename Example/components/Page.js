import React from 'react';
import { ImageBackground, StyleSheet, SafeAreaView, ScrollView,View } from 'react-native';

const Page = ({ children }) => (
  
    <SafeAreaView style={styles.safe}>

          <ScrollView style={styles.scrollView}>{children}
          <Separator />
          </ScrollView>
    </SafeAreaView>
);
const Separator = () => (
  <View style={styles.separator} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
    scrollView: {
    paddingRight: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
    
  },
  background: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
    safe: {
    flex: 1,
  }
});

export default Page;
