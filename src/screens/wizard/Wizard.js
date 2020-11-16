import React, { Component } from 'react';
import {
  Alert,
  View,
  Text
} from 'react-native';

import Wizard from './Wizard_layout';

import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import Step4 from "./steps/step4";

export default class App extends Component {
  handleSubmitWizard = () => {
    Alert.alert('Wizard has been submitted');
  }

  render() {
    const steps = [
      { component: Step1, routeName: 'Step1' },
      { component: Step2, routeName: 'Step2' },
      { component: Step3, routeName: 'Step3' },
      { component: Step4, routeName: 'Step4' },

    ];
    return (
      <Wizard
        handleSubmitWizard={this.handleSubmitWizard}
        steps={steps}
        title='Basic Wizard Example'
      >
         
      </Wizard>
    );
  }
}

const Button = () => (
   <Text>
       Mr mr rmr
   </Text>
  );