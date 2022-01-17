import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KeyList from './src/components/KeyList';
import TaskList from './src/components/TaskList';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

const AnimatableBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
  const [task, setTask] = useState([  ]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [cont, setCont] = useState('');
//Buscando todas as tarefas ao iniciar o app
  useEffect(()=>{
    
    async function loadTasks(){
      const taskStorage = await AsyncStorage.getItem('@task');

      if(taskStorage){
        setTask(JSON.parse(taskStorage));
      }
    }
    
    loadTasks();
  },[]);
//salvando caso tenha alguma tarefa alterada
  useEffect(()=>{
    async function saveTasks(){
      await AsyncStorage.setItem('@task',JSON.stringify(task));
    }

    saveTasks();
  }, [task]);

  function handleAdd() {
    if (input === '' || cont === ''){
      alert("Insira os campos corretamente!");
      setInput('');
      setCont('');
      return;
    };

    const data = {
      key: cont,
      task: input
    };

    setTask([...task, data]);
    setOpen(false);
    setInput('');
    setCont('');

  }
  const handleDelete = useCallback((data) =>{
    const find = task.filter(r => r.key !== data.key);
    setTask(find);
  })

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar backgroundColor='#171d31' barStyle="ligth-content" />
      <View style={styles.content}>
        <Text style={styles.title}> Contatos do Jhon Wesley </Text>
      </View>

      <FlatList
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false} // desativa barra de scroll
        data={task} // contem todos itens da lista
        keyExtractor={(item) => String(item.key)} // cada item tem uma chave
        renderItem={({ item }) => <KeyList data={item} handleDelete={handleDelete} /> }
        // rederiza (mostra) os itens  
      />

      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={styles.container}>


          <Animatable.View style={styles.modalBody} animation="fadeInUp" useNativeDriver >


            <View style={styles.modalHeader}>

              <TouchableOpacity  onPress={() => setOpen(false)}>
                <Ionicons style={{fontSize:30, color:'white'}}name="md-arrow-back"></Ionicons>
              </TouchableOpacity>

              <Text style={styles.title}>Novo contato</Text>
            </View>
            <TextInput
              multiline={true}
              placeholderTextColor="#747474"
              autoCorrect={false}
              placeholder="Entre com o telefone"
              style={styles.input}
              value={cont}
              onChangeText={(text) => setCont(text)}
            />
            <TextInput
              multiline={true}
              placeholderTextColor="#747474"
              autoCorrect={false}
              placeholder="Entre com o nome"
              style={styles.input}
              value={input}
              onChangeText={(text) => setInput(text)}
            />
            
            <TouchableOpacity style={styles.title} onPress={handleAdd}>
              <Text style={{
                flex: 1,    
                margin: 8,
                flexDirection: 'row',
                alignItems:'center',
                backgroundColor: '#FFF',
                borderRadius: 5,
                padding: 7,
                elevation: 1.5,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowOffset: {
                  width: 1,
                  height: 3
                },
                color: "#121212",
                fontSize: 20,
                paddingLeft: 8,
                paddingRight: 20,
             }}  
            >Cadastrar</Text>
            </TouchableOpacity>
          </Animatable.View>

        </SafeAreaView>
      </Modal>

      <AnimatableBtn style={styles.fab}
        style={styles.fab}
        useNativeDriver
        animation="bounceInUp"
        duration={1500}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="ios-add" size={35} color="#FFF" />
      </AnimatableBtn>

    </SafeAreaView>


  );
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#171d31',
  },
  title:{
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    textAlign:"center",
    color:'white',
  },
  input:{
    fontSize:15,
    marginLeft:10,
    marginRight:10,
    marginTop:10,
    backgroundColor:'#FFF',
    padding:9,
    height:85,
    textAlignVertical:'top',
    color:'#000',
    borderRadius:5,
  },
  fab:{
    position: 'absolute',
    width: 60,
    heigth: 60,
    backgroundColor: '#0094FF',
    alignItems:'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    modal:{
      flex:1,
      backgroundColor:'#171d31',
    },
    modalHeader:{
      marginLeft:20,
      marginTop:20,
      flexDirection:'row',
      backgroundColor: '#171d31',
    },
    modalTitle:{
      marginLeft:15,
      fontSize:100,
      color:'#FFF',
    },
    modalBody:{
      marginTop:15,
    },
    handleAdd:{
      backgroundColor:'#FFF',
      marginTop:10,
      alignItems:'center',
      justifyContent:'center',
      marginLeft:10,
      marginRight:10,
      height:40,
      borderRadius:5
    },
    handleAddText:{
      fontSize:20,
    },
    modalBack:{
    backgroundColor: 'red',
    
    },
  }
})
