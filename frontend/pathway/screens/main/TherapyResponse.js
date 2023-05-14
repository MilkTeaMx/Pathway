import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {FontAwesome} from "@expo/vector-icons"
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { theme } from 'native-base';



import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Firebasekeys from './../../config'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
let firebaseConfig = Firebasekeys;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}




const themecolor = '#28407E'

const numStars = 5

const category = 'mental health'

export default class TherapyResponse extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        rating: 1,
        animation: new Animated.Value(1)
    }


    
    // state = {
    //     rating: 1,
    //     animation: new Animated.Value(1)
    // }

    rate = star => {
        this.setState({rating: star})
    }

    animate = () => {
        Animated.timing(this.state.animation, {
            toValue: 2,
            duration: 100,
            
            useNativeDriver: true
        }).start (() => {
            this.state.animation.setValue(1)
        })
    }

    render () {
        let stars = []

        const animateScale = this.state.animation.interpolate({
            inputRange: [1,1.5,2],
            outputRange: [1, 1.4, 1]
        })

        const animationStyle = {
            transform: [{scale: animateScale}]
        }

        for (let x = 1; x <= numStars; x++){
            stars.push(
                <TouchableWithoutFeedback key={x} onPress={() => {
                    this.rate(x), this.animate()
                }}>
                    <Animated.View style={x <= this.state.rating ? animationStyle: ""}>
                        <Star filled={x <= this.state.rating ? true: false}/>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )
        }

        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.bubble}>
                        <Text style={styles.title}>Selected Resource</Text>
                        <Text style={styles.text}>
                            This resource will help deal with the category of {category}. Click below to access the resource. Once you have utilized the resource, please let rate the effectiness of that reosurce on a scale of 1-5. 
                        </Text>                        
                        <View style={{flexDirection: "row", alignItems: 'flex-end', padding: 20}}>
                            {stars}
                        </View>
                        <TouchableOpacity activeOpacity={1}>
                            <View style={styles.loginButton}>
                                <Text style={styles.whiteText}>Access Resource</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => this.handleSubmit}>
                            <View style={styles.loginButton}>
                                <Text style={styles.whiteText} >Submit Feedback</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                
            </View>
        )
    }
}

class Star extends React.Component {
    render(){
        return <FontAwesome name={this.props.filled === true ? "star": "star-o"} color={themecolor} size={32} style={{marginHorizontal: 6}}/>
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bubble: {
    alignItems: "center",
    width: wp(70),
    height: hp(70),
    margin: 8,
    borderRadius: 20,
    shadowRadius: 10,
    backgroundColor: '#fff',
    shadowOpacity: 0.1,
    flexDirection: 'column',
    },
   title: {
        fontSize: 26,
        fontFamily: 'Avenir',
        padding: 20,
        fontWeight: 'bold'
    },
    text: {
        padding: 20,
        fontSize: 16,
        fontFamily: 'Avenir'
    },
    loginButton: {
        borderRadius: 12,
        marginTop: hp(2.37),
        backgroundColor: `${themecolor}`,
        height: hp(7.11),
        shadowOffset: { width: wp(0), height: wp(0.24) },
        shadowColor: "black",
        shadowOpacity: 0.25,
        alignItems: "center",
        justifyContent: "center",
      },
    whiteText: {
        padding: 20,
        fontSize: 16,
        fontFamily: 'Avenir',
        color: '#fff'
    }
});

