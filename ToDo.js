import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Dimensions } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import PropTypes from 'prop-types'

const {width,height} = Dimensions.get('window')

export default class ToDo extends Component {
    constructor(props){
        super(props);
        this.state={
            isEditing:false,
            toDoValue:this.props.text
        }
    }
  
    static propTypes = {
        text:PropTypes.string.isRequired,
        isCompleted:PropTypes.bool.isRequired,
        deleteToDo:PropTypes.func.isRequired,
        id:PropTypes.string.isRequired,
        completeToDo:PropTypes.func.isRequired,
        incompleteToDo:PropTypes.func.isRequired,
        updateToDo:PropTypes.func.isRequired,
    }

  handleTextChange = (text) => {
    this.setState({
          toDoValue: text
      })
  }

  handleToggle = (event) => {
    event.stopPropagation()
    const {isCompleted, incompleteToDo, completeToDo, id} = this.props
    if(isCompleted){
        incompleteToDo(id)
    } else{
        completeToDo(id)
    }
  }

  beginEditing = (event) => {
    event.stopPropagation()
    this.setState({
        isEditing:true,
    })
  }

  quitEditing = (event) => {
    event.stopPropagation()
    const{toDoValue} = this.state
    const{id, updateToDo} = this.props
    updateToDo(id,toDoValue)
    this.setState({
        isEditing:false,
        toDoValue:this.state.toDoValue
    })
  }

  render() {
    const {isEditing,toDoValue} = this.state;
    const { id,deleteToDo,isCompleted } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.column}>
            <TouchableOpacity onPress={this.handleToggle}>
                <View 
                    style={[
                        styles.circle, 
                        isCompleted? styles.completedCircle : styles.incompletedCircle
                        ]} />
            </TouchableOpacity>
            {isEditing?(
                <TextInput 
                    style={[styles.input,styles.text, isCompleted? styles.completedText : styles.incompletedText]} 
                    value={toDoValue} 
                    multiline={true}
                    onChangeText={this.handleTextChange}
                    returnKeyType='done'
                    onBlur={this.quitEditing} />
            ):(
                <Text style={[
                    styles.text,
                    isCompleted? styles.completedText : styles.incompletedText]}>{toDoValue}</Text>
        
            )}
            </View>
            {isEditing?(
                <View style={styles.actions}>
                    <TouchableOpacity onPress={this.quitEditing}>
                        <View style={styles.actionContainer}>
                            <Text style={styles.actionText}>✅</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ):(
                <View style={styles.actions}>
                    <TouchableOpacity onPress={this.beginEditing}>
                        <View style={styles.actionContainer}>
                            <Text style={styles.actionText}>✏️</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(event)=>{
                                        event.stopPropagation;
                                        deleteToDo(id)}}>
                        <View style={styles.actionContainer}>
                            <Text style={styles.actionText}>❌</Text>
                        </View>
                    </TouchableOpacity>
                </View>   
            )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        width:width-50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    column:{
        flexDirection:'row',
        alignItems:'center',
        width:width/2
    },
    circle:{
        width:30,
        height:30,
        borderRadius: 15,
        borderWidth:3,
        marginRight:10
    },
    completedCircle:{
        borderColor:'#bbb'
    },
    incompletedCircle:{
        borderColor:'#f23567'
    },
    text:{
        fontWeight:'600',
        fontSize:20,
        marginVertical: 20,
    },
    completedText:{
        color:"#bbb",
        textDecorationLine:'line-through'
    },
    incompletedText:{
        color:'#353535'
    },
    actions:{
        flexDirection:'row',
    },
    actionContainer:{
        marginVertical:10,
        marginHorizontal:10,
    },
    input:{
        width:width/2,
        marginVertical:15,
        paddingBottom: 5,
    }
})