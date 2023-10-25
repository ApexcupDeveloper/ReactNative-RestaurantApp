import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import {Layout, useTheme, Text} from '@ui-kitten/components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {updateProfileData} from '../redux/actions/data';
import {SET_LOADING, SET_USER} from '../redux/types';
import Toast from 'react-native-toast-message';
import {request, PERMISSIONS} from 'react-native-permissions';
import {Spinner} from '../components/spinner';
import {PROFILE_URL} from '../api/constant';
import {zipcodes} from '../utils/validateZipcode';

export const EditProfileScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const loading = useSelector(state => state.auth.loading);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameChanged, setFirstNameChanged] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameChanged, setLastNameChanged] = useState(false);
  const [zip, setZip] = useState('');
  const [zipChanged, setZipChanged] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [updatable, setUpdatable] = useState(false);
  const [photoChanged, setPhotoChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setPhone(user.phone);
      setZip(user.zip);
      setAvatar(PROFILE_URL + user.image);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (
        user.email !== email ||
        user.phone !== phone ||
        user.first_name !== firstName ||
        user.zip !== zip ||
        user.last_name !== lastName ||
        PROFILE_URL + user.image !== avatar
      ) {
        setUpdatable(true);
      } else {
        setUpdatable(false);
      }
    }
  }, [user, phone, firstName, lastName, avatar, zip, email]);

  const onReset = () => {
    setEmail(user.email);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhone(user.phone);
    setAvatar(PROFILE_URL + user.image);
    setPhoto(null);
    setPhotoChanged(false);
  };

  const goBack = () => {
    setPhoto(null);
    navigation.goBack();
  };

  const createFormData = (photo, body = {}) => {
    const data = new FormData();

    if (photo) {
      let pathParts = photo.path.split('/');

      let file = {
        name:
          Platform.OS === 'ios'
            ? photo.filename
            : pathParts[pathParts.length - 1],
        type: photo.mime,
        filename:
          Platform.OS === 'ios'
            ? photo.filename
            : pathParts[pathParts.length - 1],
        uri: photo.path,
      };
      data.append('uimage', file);
      // console.log("file : ", file)
      Object.keys(body).forEach(key => {
        data.append(key, body[key]);
      });
    } else {
      Object.keys(body).forEach(key => {
        data.append(key, body[key]);
      });
    }

    return data;
  };

  const chooseImage = () => {
    Alert.alert('Choose', 'Do you want to use Camera or Gallery?', [
      {
        text: 'Use Camera',
        onPress: () => {
          request(
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.CAMERA
              : PERMISSIONS.ANDROID.CAMERA,
          ).then(result => {
            if (result === 'granted') {
              ImagePicker.openCamera({
                width: 400,
                height: 400,
                cropping: true,
                includeBase64: true,
              })
                .then(image => {
                  setUpdatable(true);
                  setPhotoChanged(true);
                  setPhoto(image);
                })
                .catch(err => {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: err.message,
                  });
                });
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Camera permission is not allowed.',
              });
            }
          });
        },
      },
      {
        text: 'Use Gallery',
        onPress: () => {
          request(
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.PHOTO_LIBRARY
              : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          ).then(result => {
            if (result === 'granted') {
              ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true,
                includeBase64: true,
              })
                .then(image => {
                  setUpdatable(true);
                  setPhotoChanged(true);
                  setPhoto(image);
                })
                .catch(err => {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: err.message,
                  });
                });
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Gallery permission is not allowed.',
              });
            }
          });
        },
      },
      {
        text: 'Cancel',
        onPress: () => {},
      },
    ]);
  };

  const onUpdate = async () => {
    if (zipChanged && zip && zip.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid zip code',
      });
      return;
    }

    if (zipChanged && !zipcodes.includes(Number(zip))) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid zip code',
      });
      return;
    }
    if (phoneChanged && phone && phone.length !== 11 && phone.length !== 8) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid phone number',
      });
      return;
    }

    updateProfileData(
      dispatch,
      photoChanged
        ? createFormData(photo, {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone.length === 8 ? '+45' + phone : phone,
            zip: zip,
          })
        : createFormData(null, {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone.length === 8 ? '+45' + phone : phone,
            zip: zip,
          }),
      token,
    )
      .then(res => {
        dispatch({
          type: SET_USER,
          payload: res,
        });
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
        setUpdatable(false);
      })
      .catch(err => {
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err,
        });
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Spinner visible={loading} />
      <Layout
        style={{
          backgroundColor: theme['color-basic-300'],
          paddingHorizontal: '5%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 40,
          paddingTop: Platform.OS === 'ios' ? 10 : 30,
        }}>
        <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress={goBack}>
          <AntDesign name="arrowleft" color={'black'} size={24} />
        </TouchableOpacity>
        <Text category="h4" style={{color: theme['color-basic-1000']}}>
          Edit Profile
        </Text>
        <TouchableOpacity />
      </Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Layout
          style={{
            backgroundColor: theme['color-basic-300'],
            paddingHorizontal: '5%',
            alignItems: 'center',
          }}>
          <View style={styles.avatar}>
            <Image
              source={
                photo
                  ? {uri: photo.path}
                  : avatar
                  ? {uri: avatar}
                  : require('../../assets/img/img_avatar.png')
              }
              style={{height: 100, width: 100, borderRadius: 50}}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 30,
                height: 30,
                borderRadius: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme['color-danger-500'],
              }}
              onPress={chooseImage}>
              <AntDesign name="plus" size={20} color={'white'} />
            </TouchableOpacity>
          </View>
        </Layout>
        <Layout
          style={{
            paddingVertical: 0,
            paddingHorizontal: '5%',
            backgroundColor: theme['color-basic-300'],
            marginTop: 30,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text
              style={{color: theme['color-basic-1000'], fontWeight: 'bold'}}>
              First Name
            </Text>
            <TextInput
              value={firstName}
              onChangeText={e => {
                setFirstName(e);
                setFirstNameChanged(true);
              }}
              style={{
                color: theme['color-basic-800'],
                fontSize: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme['color-primary-300'],
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text
              style={{color: theme['color-basic-1000'], fontWeight: 'bold'}}>
              Last Name
            </Text>
            <TextInput
              value={lastName}
              onChangeText={e => {
                setLastName(e);
                setLastNameChanged(true);
              }}
              style={{
                color: theme['color-basic-800'],
                fontSize: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme['color-primary-300'],
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text
              style={{color: theme['color-basic-1000'], fontWeight: 'bold'}}>
              Email
            </Text>
            <TextInput
              value={email}
              editable={!user.email}
              onChangeText={setEmail}
              style={{
                color: !user.email
                  ? theme['color-basic-800']
                  : theme['color-basic-600'],
                fontSize: 16,
                borderBottomWidth: !user.email ? 1 : 0,
                borderBottomColor: theme['color-primary-300'],
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text
              style={{color: theme['color-basic-1000'], fontWeight: 'bold'}}>
              Phone
            </Text>
            <TextInput
              value={phone}
              // editable={!user.phone}
              onChangeText={e => {
                setPhone(e);
                setPhoneChanged(true);
              }}
              keyboardType="number-pad"
              style={{
                color: theme['color-basic-800'],
                fontSize: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme['color-primary-300'],
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text
              style={{color: theme['color-basic-1000'], fontWeight: 'bold'}}>
              Zip Code
            </Text>
            <TextInput
              value={zip}
              onChangeText={e => {
                setZip(e);
                setZipChanged(true);
              }}
              keyboardType="number-pad"
              style={{
                color: theme['color-basic-800'],
                fontSize: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme['color-primary-300'],
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}
            />
          </View>
          {updatable && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                marginTop: 50,
              }}>
              <TouchableOpacity
                style={{
                  width: '40%',
                  height: 40,
                  backgroundColor: theme['color-primary-500'],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                }}
                onPress={onUpdate}>
                <Text style={{fontWeight: 'bold'}}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '40%',
                  height: 40,
                  backgroundColor: theme['color-danger-500'],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                }}
                onPress={onReset}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  incomplete: {
    width: '100%',
    borderRadius: 10,
  },
  card: {
    width: 104,
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});
