import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Input, Icon } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';

class step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue1: '',
      inputValue2: ''
    };
  }

  nextStep = () => {
    const { next, saveState } = this.props;
    // Save state for use in other steps
    saveState({ name: "samad" });

    // Go to next step
    next();
  };
  

  goBack() {
    const { back } = this.props;
    // Go to previous step
    back();
  }

  render() {
    return (
      <View>
        <Text> Step 3 </Text>

        <Text>{this.state.inputValue1}</Text>
        <Text>First Input</Text>
        <RNPickerSelect
            onValueChange={(value) => this.setState({inputValue1: value})}
            items={[
                { label: 'Football', value: 'football' },
                { label: 'Baseball', value: 'baseball' },
                { label: 'Hockey', value: 'hockey' },
            ]}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Icon name="ios-arrow-down" type='ionicon' size={22} color="purple" />;
            }}
        />

        <Text>{this.state.inputValue2}</Text>
        <Text>Second Input</Text>
        <RNPickerSelect
            onValueChange={(value) => this.setState({inputValue2: value})}
            items={[
                { label: 'Football', value: 'football' },
                { label: 'Baseball', value: 'baseball' },
                { label: 'Hockey', value: 'hockey' },
            ]}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Icon name="ios-arrow-down" type='ionicon' size={22} color="purple" />;
            }}
        />
         <View>
          <TouchableOpacity onPress={() => this.goBack()}>
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.nextStep()}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default step3;