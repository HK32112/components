import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen({ route, navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    async function getPermission() {
      requestPermission(await Camera.requestCameraPermissionsAsync());
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload a photo.');
      }
    }
    getPermission();
  }, []);

  async function takePhoto() {
    if (camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => sendToServer(data),
      };
      const data = await camera.takePictureAsync(options);
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      sendToServer(result);
    }
  }

  async function sendToServer(data) {
    const id = await AsyncStorage.getItem('whatsthat_user_id');
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    const res = await fetch(data.uri);
    const blob = await res.blob();

    console.log(id);

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
      method: 'POST',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'image/jpeg',
      },
      body: blob,
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Image updated');
          navigation.navigate('Profile');
        } else {
          throw 'Something happened';
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  if (!permission || !permission.granted) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
          <View style={styles.buttonContainer}>
            <Button
              title="Flip Camera"
              onPress={toggleCameraType}
              buttonStyle={styles.button}
              titleStyle={styles.text}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Take Photo"
              onPress={takePhoto}
              buttonStyle={styles.button}
              titleStyle={styles.text}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Upload Photo"
              onPress={pickImage}
              buttonStyle={styles.button}
              titleStyle={styles.text}
            />
          </View>
        </Camera>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 20,
    margin: 15,
  },
  button: {
    backgroundColor: 'steelblue',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ddd',
  },
  camera: {
    flex: 1,
  },
});
