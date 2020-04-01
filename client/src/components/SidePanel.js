import React, { Component } from 'react'
import { reveal as Slide } from 'react-burger-menu'
import Firebase from './Firebase'
import { withFirebase } from "./Firebase";
const firebase = new Firebase()
class SidePanel extends Component {

  // showSettings(event) {
  //   event.preventDefault();
  //   .
  //   .
  //   .
  // }

  render() {
console.log(firebase.getData())
    // SOURCE: https://github.com/negomi/react-burger-menu#styling
    return (
      <Slide>
        <p>side bar</p>
      </Slide>
    );
  }
}

export default SidePanel 