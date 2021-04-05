import React, { useEffect, useState, useRef } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, Share, TouchableOpacity, Keyboard, ScrollView, FlatList, Alert } from 'react-native';
import Task, { generateRandomId } from './Task';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Icon3 from 'react-native-vector-icons/Ionicons';
import { openDatabase } from 'react-native-sqlite-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Overlay } from 'react-native-elements';
var db = openDatabase({ name: 'UserDatabase.db' });
import ThemeContext from './Context';


const Liste = ({ navigation }) => {

  const {color,nightMode} = React.useContext(ThemeContext);
  let [flatListItems, setFlatListItems] = useState([]);
  const [silKontrol, setSilKontrol] = useState(false)
  const [visibleRemove, setVisibleRemove] = useState(false);


  const toggleOverlayRemoveTodo = () => {
    setVisibleRemove(!visibleRemove);
  };

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT id,todo,tutar,tarih FROM SHOPPINGS",
        [],
        function (tx, results) {
          var temp = [];

          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
          if (results.rows.length == 0) {

            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS SHOPPINGS(id INTEGER PRIMARY KEY AUTOINCREMENT, todo VARCHAR(200),tutar VARCHAR(20),tarih VARCHAR(50))',
              []
            );
          }
        }
      );
    });
  }, [silKontrol]);

  const silKontrolu = () => {

    setTimeout(() => {
      navigation.navigate('Liste')
      setSilKontrol(!silKontrol)
    }, 1000);


  }



  const dbKayitSil = (id) => {

    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM SHOPPINGS where id=?',
        [id],
        (tx, results) => {
         
          if (results.rowsAffected > 0) {
            toggleOverlayRemoveTodo()
            silKontrolu();
          } else {
            alert('Hata oluştu');
          }
        }
      );
    });
  }

  const onShare = (id) => {
    
    var sonuc = []
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT id,todo,tutar,tarih FROM SHOPPINGS WHERE id=?",
        [id],

        (tx, results) => {
          var len = results.rows.length;
          
          if (len > 0) {
            
            sonuc = results.rows.item(0)["todo"].split("&&&").join("")


            try {
              const result = Share.share({
                message:
                  sonuc.split(",").join(" "),
              });
              if (result.action === Share.sharedAction) {
                if (result.activityType) {
                  // shared with activity type of result.activityType
                } else {
                  // shared
                }
              } else if (result.action === Share.dismissedAction) {
                // dismissed
              }
            } catch (error) {
              alert(error.message);
            }
          } else {
            alert('Hata oluştu');
          }
        }
      );
    });



  };

  let listItemView = (item) => {
    var arry = []
    arry = item.todo.split("&&&")

    arry.pop();

    return (
      <View
        key={item.todo}
        style={{
         backgroundColor: nightMode? '#dbf6e9' : 'white' , borderWidth: 1, borderColor: "#55BCF6", padding: 10, borderRadius: 10, margin: 5, marginLeft: 10,
          marginRight: 10, flexDirection: 'row', flex: 10
        }}>

        <View style={{ width: '100%', flex: 1 }}>
          <Text style={{ color: '#9fd8df', fontWeight: "bold", textAlign: 'center' }}>Ürünler</Text>
          <View style={{ flexWrap: 'wrap', flex: 1, flexDirection: 'row' }}>
            {
              arry.map((i, index) => {

                return (

                  <Text key={index}
                    style={{
                      borderWidth: 1, borderColor: '#55BCF6', color: '#9fd8df',
                      marginLeft: 2, marginRight: 2, marginBottom: 2, borderRadius: 5, padding: 3
                    }}>
                    {i.split(",").join("")}
                  </Text>


                )
              })
            }
          </View>
          
        

          <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:3,alignItems:'center',borderTopWidth:1,borderTopColor:'#55BCF6'}}>

          <Icon2 name="cash-register" size={25} color="#55BCF6"  style={{fontSize:20}}> {item.tutar} </Icon2>
          
          <Icon name="remove" size={30} color="#55BCF6" onPress={() => dbKayitSil(item.id)} />
          <Icon name="share" size={25} color="#55BCF6" onPress={() => onShare(item.id)} />
          
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:3,alignItems:'center'}}>
          <Icon name="registered" size={25} color="#55BCF6"  style={{fontSize:15}}>  {item.id}</Icon>
          <Icon3 name="time-outline" size={30} color="#55BCF6" style={{fontSize:15}} >{item.tarih}</Icon3>
          </View>
        </View>

       
        <Overlay isVisible={visibleRemove} onBackdropPress={toggleOverlayRemoveTodo} style={{ width: '100%', flexDirection: 'row' }}>
          <View style={{ width: 250, backgroundColor: 'white', borderRadius: 5, alignItems: 'center' }}>

            <Icon3 name="md-remove-circle-outline" size={45} color="red"
              style={{ textAlign: 'center', marginBottom: 20, paddingTop: 2 }}
            />

            <Text style={{ textAlign: 'center', marginBottom: 20 }}>Kayıt Silindi</Text>
          </View>
        </Overlay>
      </View>
    );
  };

  return (
    <View style={{flex:1,backgroundColor: nightMode? '#3c415c' : 'white'}}>
      <FlatList
        style={{ marginTop: 10 }}
        data={flatListItems}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({ item }) => listItemView(item)}
      >
      </FlatList>
    </View>
  )
}

const styles = StyleSheet.create({

});

export default Liste