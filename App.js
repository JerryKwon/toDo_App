import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import ToDo from './ToDo';
import uuidv1 from 'uuid/v1'


const {height,width} =Dimensions.get('window')

export default class App extends React.Component {
  state={
    newToDo:"",
    loadedToDos:false,
    toDos:{}
  }
  
  handleChange = (text) =>{
    this.setState({
      newToDo:text
    })
  }

  componentDidMount = () => {
    this.loadToDos();
  };
  
  loadToDos = async() => {
    try{
      const toDos = await AsyncStorage.getItem('toDos')
      const parsedToDos = JSON.parse(toDos)
      this.setState({ loadedToDos:true,toDos:parsedToDos })
    }catch(err){
      console.log(err)
    }
  }

  addToDo = () => {
    const {newToDo} = this.state;
    if(newToDo !== ""){
      this.setState(prevState=>{
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted:false,
            text:newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo:'',
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this.saveToDos(newState.toDos)
        return {...newState} ;
      })
    }
  }

  deleteToDo = (id) => {
    this.setState(prevState=>{
        const toDos = prevState.toDos;
        delete toDos[id];
        const newState={
            ...prevState,
            ...toDos
        }
        this.saveToDos(newState.toDos)
        return {...newState}
      })
  }

  incompleteToDo = (id) => {
    this.setState(prevState=>{
      const newState={
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            isCompleted:false
          }
        }
      }
      this.saveToDos(newState.toDos)
      return {...newState};
    })
  }

  completeToDo = (id) => {
    this.setState(prevState=>{
      const newState={
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            isCompleted:true
          }
        }
      }
      this.saveToDos(newState.toDos)
      return newState
    })
  }

  updateToDo = (id,text) => {
    this.setState(prevState=>{
      const newState={
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            text:text
          }
        }
      }
      this.saveToDos(newState.toDos)
      return newState
    })
  }

  saveToDos = (newToDos) => {
    // console.log(JSON.stringify(newToDos))
    const saveToDos = AsyncStorage.setItem('toDos',JSON.stringify(newToDos))
  }

  render() {
    const {newToDo, loadedToDos, toDos} = this.state
    console.log(width,height)
    // console.log(toDos)
    if(!loadedToDos){
      return <AppLoading />
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content'/>
        <Text style={styles.titleText}>What To do?</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder='New To Do' 
            placeholderTextColor="#999"
            onChangeText={this.handleChange} 
            value={newToDo}
            returnKeyType={'done'}
            autoCorrect={false}
            onSubmitEditing={this.addToDo}
            />
          <ScrollView contentContainerStyle={styles.todos}>
            {Object.values(toDos).reverse().map(toDo => 
                <ToDo 
                    key={toDo.id} 
                    {...toDo} 
                    deleteToDo={this.deleteToDo}
                    completeToDo={this.completeToDo}
                    incompleteToDo={this.incompleteToDo}
                    updateToDo={this.updateToDo}
                    />)}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center',
  },
  titleText:{
    marginTop:50,
    color:'white',
    fontSize:30,
    fontWeight:'200'
  },
  card:{
    backgroundColor:'white',
    flex:1,
    width:width - 25,
    marginTop:20,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50,50,50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height:-1,
          width:0
        },
      },
      android: {
        elevation:3
      }
    })
  },
  input:{
    padding:20,
    borderBottomColor:'grey',
    borderBottomWidth: 1,
    fontSize:25,
  },
  todos:{
    alignItems:'center'
  }
});
