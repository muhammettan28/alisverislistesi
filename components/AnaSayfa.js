import React, { useEffect, useState, useRef } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Vibration, TextInput, Share, TouchableOpacity, Keyboard, ScrollView, FlatList, Alert } from 'react-native';
import Task, { generateRandomId } from './Task';
import Liste from './Liste'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/Fontisto';
import { openDatabase } from 'react-native-sqlite-storage';
import { NavigationContainer } from '@react-navigation/native';
var db = openDatabase({ name: 'UserDatabase.db' });
import { Overlay } from 'react-native-elements';
import ThemeContext from './Context';

const AnaSayfa = ({ navigation }) => {
  const {color,nightMode} = React.useContext(ThemeContext);
  
  const ONE_SECOND_IN_MS = 1000;

  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS
  ];

  const PATTERN_DESC =
    Platform.OS === "android"
      ? "wait 1s, vibrate 2s, wait 3s"
      : "wait 1s, vibrate, wait 2s, vibrate, wait 3s";

  const [task, setTask] = useState({ id: "", text: "", tutar: 0, birim: "Kg", magaza: "" });
  const [tutar, setTutar] = useState("")
  const [miktar, setMiktar] = useState("")
  const [birim, SetBirim] = useState("Kg")
  const [taskItems, setTaskItems] = useState([]);
  const [magaza, setMagaza] = useState("");

  const [sepetTutar, setSepetTutar] = useState(0) // taskitems içindeki objelerin tutarlarını toplar
  const [tutarDegKontrol, setTutarDegKontrol] = useState(false) // task.js input onBlur eventındaki değişikliği kontrol eder
  const [miktarDegKontrol, setMiktarDegKontrol] = useState(false) // task.js input onBlur eventındaki değişikliği kontrol eder
  const inputEl = useRef();
  const [klavyeKontrol, setKlavyeKontrol] = useState(false)

  const [visibledbKaydet, setVisibledbKaydet] = useState(false);
  const [visibledbKaydetFail, setVisibledbKaydetFail] = useState(false);
  const [visibleRemove, setVisibleRemove] = useState(false);

  const toggleOverlaydbKaydetBasarili = () => {
    setVisibledbKaydet(!visibledbKaydet);
  };

  const toggleOverlaydbKaydetFail = () => {
    setVisibledbKaydetFail(!visibledbKaydetFail);
  };

  const toggleOverlayRemoveTodo = () => {
    setVisibleRemove(!visibleRemove);
  };

  var toplamtutar = 0
  useEffect(() => { // ürün ekleme esnasında sayfanın yenıden render edilmesi
    for (var i = 0; i < taskItems.length; i++) {
      toplamtutar += parseInt(taskItems[i].tutar)
    }
    setSepetTutar(toplamtutar)

  }, [taskItems])


  useEffect(() => { // açılışta tüm kayıtların listelenmesi
    db.transaction(function (txn) {

      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS SHOPPINGS(id INTEGER PRIMARY KEY AUTOINCREMENT, todo VARCHAR(200),tutar VARCHAR(20),tarih VARCHAR(50))',
        []
      );
    });
  }, [])



  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

  }, [])


  const _keyboardDidShow = () => {
    setKlavyeKontrol(true)
  };

  const _keyboardDidHide = () => {
    setKlavyeKontrol(false)
  };

  useEffect(() => { // task.js input onBlur eventındaki değişikliği kontrol eder
    for (var i = 0; i < taskItems.length; i++) {
      toplamtutar += parseInt(taskItems[i].tutar)
    }
    if (!isNaN(toplamtutar)) {
      setSepetTutar(toplamtutar)
    } else {
      setSepetTutar(0)
    }


  }, [tutarDegKontrol])



  const handleTutar = () => { // child prop a gönderilen tutar kontrolunun tetiklenmesi
    setTutarDegKontrol(!tutarDegKontrol)
  }


  const handleMiktar = () => { // child prop a gönderilen tutar kontrolunun tetiklenmesi
    setMiktarDegKontrol(!miktarDegKontrol)
  }

  const handleAddTask = () => {
    Keyboard.dismiss();

    if (!task.text.trim()) {
      alert("Boş bırakma")
    } else {
      setTaskItems([...taskItems, task])
      Vibration.vibrate(1 * ONE_SECOND_IN_MS / 10)

      setTutar(0)
      inputEl.current.clear();
      //setColor("dark")
    }
  }

  const handleMagaza = (magaza) => {
    setMagaza(magaza)
    
  }

  const removeTodo = (id) => {


    for (var i = 0; i < taskItems.length; i++) {

      if (taskItems[i].id === id) {
        var index = taskItems.indexOf(taskItems[i])
        toggleOverlayRemoveTodo();
        let itemsCopy = [...taskItems];
        itemsCopy.splice(index, 1);
        setTaskItems(itemsCopy)

      }
    }
    setTutar(0);
    setMiktar(0);
    setTask({ id: "", text: "", tutar: 0 })

  }




  const dbKaydet = () => {
    var todos = []
    var d = Date(Date.now());

    taskItems.forEach(function (titems) {
      todos.push(titems.text)

      if (titems.tutar != "" && titems.tutar != 0 && titems.tutar != "0") {
        todos.push(titems.tutar + " ₺ ")
      }

      if (titems.miktar != "" && titems.miktar != 0 && titems.miktar != "0") {
        todos.push(titems.miktar + " " + titems.birim);
      }

      if (titems.magaza != "" && titems.magaza != undefined) {
        todos.push(" " + titems.magaza + " ");
      }

      todos.push("&&&")
    })


    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO SHOPPINGS (todo,tutar,tarih) VALUES (?,?,?)',
        [todos.toString().replace(',', ' '), sepetTutar, d.toString().substr(0, 16)],
        (tx, results) => {
          
          if (results.rowsAffected > 0) {
            toggleOverlaydbKaydetBasarili();
          } else toggleOverlaydbKaydetFail();
        }
      );
    });

  }

  const onShare = async () => {

    var arr = []
    for (var i = 0; i < taskItems.length; i++) {

      arr.push(taskItems[i].text + " ")
      if (taskItems[i].miktar != "" && taskItems[i].miktar != "0" && taskItems[i].miktar !== undefined) {
        arr.push(taskItems[i].miktar + " " + taskItems[i].birim)
      }

      if (taskItems[i].tutar != "" && taskItems[i].tutar != "0" && taskItems[i].tutar !== undefined) {
        arr.push(taskItems[i].tutar + " ₺ ")
      }


      if (taskItems[i].magaza != "" || taskItems[i].magaza !== undefined) {
        arr.push(taskItems[i].magaza)
      }


    }
    try {
      const result = await Share.share({
        message:
          arr.toString().split(",").join(" "),
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
 
  };

  const handleBirim = (_birim) => {

    SetBirim(_birim)
  }

  return (

    <View style={ nightMode ? styles.containerDark: styles.container}>

      <View style={{ flex: 12}} >
        

        <View style={styles.tasksWrapper}>

          <FlatList
            data={taskItems}

            renderItem={({ item }) =>


              <Task text={item}
                style={styles.item}
                birim={text => handleBirim(text)}
                remove={id => removeTodo(id)}
                tutar={() => handleTutar()}
                miktar={() => handleMiktar()}
                magaza={text => handleMagaza(text)}>

              </Task>}
            keyExtractor={(item, index) => item.id.toString()}
          />


        </View>

      </View>


      {
        !klavyeKontrol ?
          <View style={styles.iconsView}>
            <View style={styles.iconKutucuk}>
              <Icon name="shopping-basket" size={32} color="#55BCF6" style={{ textAlign: 'center', paddingTop: 2 }} />
              <Text style={nightMode ? styles.iconTextDark : styles.iconText}>{taskItems.length}</Text>
            </View>

            <View style={styles.iconKutucuk}>
              <Icon name="save" size={35} color="#55BCF6" style={styles.icon} onPress={() => dbKaydet()} />
              <Text style={nightMode ? styles.iconTextDark : styles.iconText}>Kaydet</Text>
            </View>

            <View style={styles.iconKutucuk}>
              <Icon name="share-square" size={35} color="#55BCF6" style={styles.icon} onPress={onShare} />
              <Text style={nightMode ? styles.iconTextDark : styles.iconText}>Paylaş</Text>
            </View>

            <View style={styles.iconKutucuk}>
              <Icon name="list-alt" size={35} color="#55BCF6" onPress={() => navigation.navigate('Liste', { name: 'Liste' })} style={styles.icon} />
              <Text style={nightMode ? styles.iconTextDark : styles.iconText}>Listeler</Text>
            </View>
            <View style={styles.iconKutucuk}>
              <Icon name="credit-card" size={35} color="#55BCF6" style={styles.icon} />
              <Text style={nightMode ? styles.iconTextDark : styles.iconText}>{sepetTutar} ₺</Text>
            </View>
          </View>
          :
          null
      }





      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Ürün yazınız...'} value={task.text}
          ref={inputEl}
          onChangeText={text => setTask({ ...task, id: generateRandomId(), text: text, miktar: 0 })} />
        <Icon3 name="shopping-basket-add" size={40} onPress={() => handleAddTask()} color={"#55BCF6"}>

        </Icon3>
      </KeyboardAvoidingView>

      <Overlay isVisible={visibledbKaydet} onBackdropPress={toggleOverlaydbKaydetBasarili} style={{ width: '100%', flexDirection: 'row' }}>
        <View style={{ width: 250, backgroundColor: 'white', borderRadius: 5, alignItems: 'center' }}>

          <Icon2 name="checkmark-circle-outline" size={45} color="#55BCF6"
            style={{ textAlign: 'center', marginBottom: 20, paddingTop: 2 }}
          />

          <Text style={{ textAlign: 'center', marginBottom: 20 }}>Kayıt Başarılı</Text>
        </View>
      </Overlay>

      <Overlay isVisible={visibledbKaydetFail} onBackdropPress={toggleOverlaydbKaydetFail} style={{ width: '100%', flexDirection: 'row' }}>
        <View style={{ width: 250, backgroundColor: 'white', borderRadius: 5, alignItems: 'center' }}>

          <Icon2 name="close-sharp" size={45} color="red"
            style={{ textAlign: 'center', marginBottom: 20, paddingTop: 2 }}
          />

          <Text style={{ textAlign: 'center', marginBottom: 20 }}>Kayıt Başarısız</Text>
        </View>
      </Overlay>


      <Overlay isVisible={visibleRemove} onBackdropPress={toggleOverlayRemoveTodo} style={{ width: '100%', flexDirection: 'row' }}>
        <View style={{ width: 250, backgroundColor: 'white', borderRadius: 5, alignItems: 'center' }}>

          <Icon2 name="md-remove-circle-outline" size={45} color="red"
            style={{ textAlign: 'center', marginBottom: 20, paddingTop: 2 }}
          />

          <Text style={{ textAlign: 'center', marginBottom: 20 }}>Kayıt Silindi</Text>
        </View>
      </Overlay>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#3c415c',
    
  },
  fadingContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,

  },
  iconKutucuk: {
    flexDirection: 'column',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  },
  tasksWrapper: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10
  },
  iconsView: {
    flex: 3,
    padding: 10,
    flexDirection: 'row',
    justifyContent: "space-around",
    textAlign: 'center',
    alignItems: 'flex-start'

  },
  iconText:{
    color:'black',
    textAlign:'center',

  },
  iconTextDark:{
    color:'white',
    textAlign:'center',

  },
  icon: {
    textAlign: 'center'
  },
  items: {
    marginTop: 105,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderColor: '#55BCF6',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#55BCF6',
    borderWidth: 1,
  },
  addText: {
    color: '#55BCF6',
    fontSize: 20
  },

  urunyok: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: "center",
    textAlignVertical: 'center',
    height: '80%',
    fontSize: 24,

  }
});

export default AnaSayfa