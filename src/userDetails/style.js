import {StyleSheet  } from 'react-native';


const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      padding: 10,
      alignItems: 'center',
      margin: 10,
      backgroundColor: 'white',
      borderRadius:5
    },
    image: {
      width: 60,
      height: 80,
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    tagline: {
      color: '#666',
      fontSize:16,
      marginTop:5
    },
    bookmarkIcon: {
      width: 30,
      height: 30,
      marginLeft: 10,
    },
  });
  export default styles;