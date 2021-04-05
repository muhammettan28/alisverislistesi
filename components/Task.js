import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Fontisto';
import { Overlay, Badge } from 'react-native-elements';
import ThemeContext from './Context';
//nightMode? '#dbf6e9' : 'white'

export const generateRandomId = () => {
  var arr = [];
  while (arr.length < 1) {
    var r = Math.floor(Math.random() * 1000000) + 1;
    if (arr.indexOf(r) === -1){ 
      arr.push(r);
      
    }
  }
  return r
}

const Task = (props) => {

  const {color,nightMode} = React.useContext(ThemeContext);
  const [_tutar, _setTutar] = useState("0")
  const [_miktar, _SetMiktar] = useState("0")

  const [isEnabled, setIsEnabled] = useState(true);
  const [adMikKontrol, setAdMikKontrol] = useState(true)
  const [birim, setBirim] = useState("")
  const [visible, setVisible] = useState(false);
  const [magaza, setMagaza] = useState("");

  const toggleOverlay = () => {
    setVisible(!visible);
  };




  const handleTutar = () => {
    props.text.tutar = _tutar
   
    props.tutar()

  }


  const handleMagaza = () => {
    props.text.magaza = magaza
    props.magaza();
    setVisible(!visible);

  }



  const handleMiktar = () => {
    props.text.miktar = _miktar
   
    props.miktar()
    props.birim()
  }


  const handleBirim = () => {
    setIsEnabled(!isEnabled);
    setAdMikKontrol(!adMikKontrol)
    
  }

  useEffect(()=>{
    if (adMikKontrol===true) {
      setBirim("Adet")
      props.text.birim = birim
      
      props.birim();
    } else if(adMikKontrol===false){
      setBirim("Kg")
      props.text.birim = birim
      props.birim();
    }
    
  },[isEnabled,adMikKontrol])




  useEffect(()=>{
    handleBirim()
   },[])



  return (
    
    <View style={ nightMode? styles.itemDark: styles.item}>
      <View style={styles.itemLeft}  >
        <TouchableOpacity style={styles.square} onPress={() => props.remove(props.text.id)}><Text style={{ textAlign: 'center', justifyContent: 'center' }}>-</Text></TouchableOpacity>
        <View style={{ width: '80%' }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.itemText}>{props.text.text}</Text>
            <Switch
              trackColor={{ false: "#55BCF6", true: "#767577" }}
              thumbColor={isEnabled ? "#767577" : "#55BCF6"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleBirim}
              value={isEnabled}
            />
          </View>


          <View style={{ flex: .9, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: '48%', flexDirection: 'row' }}>
            <TextInput

              onChangeText={text => _setTutar(text)}
              value={_tutar}
              keyboardType="numeric"
              style={styles.itemTextMiktar2}
              onBlur={() => handleTutar()}
            />

<Text style={{ position: 'absolute', left: '65%', top: '30%', opacity: .4 }}>₺</Text>
             </View>
            <View style={{ width: '48%', flexDirection: 'row' }}>
              <TextInput

                onChangeText={text => _SetMiktar(text)}
                value={_miktar}
                keyboardType="numeric"
                style={styles.itemTextMiktar2}
                onBlur={() => handleMiktar()}

              />

              <Text style={{ position: 'absolute', left: '65%', top: '30%', opacity: .4 }}>
                {
                  adMikKontrol ? "Kg": "Adet"
                }
              </Text>
            </View>

          </View>

        </View>

      </View>
      <View style={{ flexDirection: 'column', width: '20%' }}>
        <Icon2 name="shopping-store" size={25} color="#55BCF6"
          style={{ textAlign: 'center', paddingTop: 2 }}
          onPress={toggleOverlay} />

        <Text style={{ flexWrap: 'wrap', fontSize: 10, textAlign: 'center' }}>{magaza}</Text>
      </View>


      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} style={{ width: '100%', flexDirection: 'row' }}>
        <View style={{ width: 250, backgroundColor: 'white', borderRadius: 5, alignItems: 'center' }}>

          <Icon2 name="shopify" size={45} color="#55BCF6"
            style={{ textAlign: 'center', marginBottom: 20, paddingTop: 2 }}
          />
          <Text style={{ textAlign: 'center', marginBottom: 15 }}>Mağaza Adı giriniz...</Text>

          <TextInput style={{ borderWidth: 1, borderColor: '#55BCF6', padding: 5, borderRadius: 15, margin: 10, width: 200, textAlign: 'center' }} value={magaza} onChangeText={text => setMagaza(text)}></TextInput>
          <TouchableOpacity style={{ width: 150, borderWidth: 1, borderColor: '#55BCF6', padding: 5, borderRadius: 5, margin: 10, backgroundColor: '#55BCF6', marginBottom: 25 }}>
            <Text style={{ textAlign: 'center', color: 'white' }} onPress={handleMagaza}>Tamam</Text></TouchableOpacity>
           
        </View>
      </Overlay>

    </View>
    
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#55BCF6",

  },
  itemDark: {
    backgroundColor: '#dbf6e9',
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#55BCF6",

  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 10
  },
  itemText: {
    maxWidth: '80%',
  },
  itemTextMiktar: {
    width: '48%',
    borderWidth: .5,
    borderColor: '#55BCF6',
    borderRadius: 5,
    padding: 5,
    textAlign: 'center',
    marginTop: 2
  },
  itemTextMiktar2: {
    width: '100%',
    borderWidth: .5,
    borderColor: '#55BCF6',
    borderRadius: 5,
    padding: 5,
    paddingLeft: '25%',
    textAlign: 'left',
    marginTop: 2
  },

});

export default Task;