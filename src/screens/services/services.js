import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import setup from  '../../setup.js';



class ServicesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      services: []
    }
  }

  componentDidMount(){
    fetch(setup.endPoint+"/services",{
        method: 'get',
    })
    .then(response => response.json())
    .then((responseJson)=> {
      this.setState({
        loading: false,
        services: responseJson.data
      })
    })
    .catch(error=>console.log(error)) //to catch the errors if any
  }


    render() {
      if(this.state.loading){
        return( 
          <View style={styles.loader}> 
            <ActivityIndicator size="large" color="#032D66"/>
          </View>
      )}
      return (
        <FlatList 
            style={styles.container}
            data={this.state.services}
            renderItem={({item}) => (
              <View style={styles.services}>
                  <Text style={styles.text}>
                     {item.name}
                  </Text>
                  <Text style={styles.details}>
                    N{item.price}
                  </Text>
              </View>
            )}
            keyExtractor= {item=>item.id.toString()}
        />
      );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: '4%',

    },
    loader:{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: '#032D66',
      fontSize: 16,
    },
    details: {
      color: '#B8860B',
      fontSize: 24,
    },
    services: {
      backgroundColor: 'white',
      width: '100%',
      marginVertical: '3%',
      padding: '8%',
      borderRadius: 10,
      shadowColor: '#B8860B',
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 2,
    },
  });

export default ServicesScreen;