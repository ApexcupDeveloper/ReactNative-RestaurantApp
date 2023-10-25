import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import {Text, Icon, useTheme} from '@ui-kitten/components';
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Modal from 'react-native-modal';
import {GiftCard} from '../components/giftCard';
import {StampCard} from '../components/stampCard';
import {DealsCard} from '../components/dealsCard';
import {LocationCard} from '../components/locationCard';
import FastImage from 'react-native-fast-image';
import {makeShort} from '../utils/makeShort';
import {addSpaceNumber} from '../utils/addSpaceNumber';
import {ASSET_URL, CAROUSEL_URL} from '../api/constant';
import {getDistance} from '../utils/getDistance';
import {useDispatch, useSelector} from 'react-redux';
import {CarouselCard} from '../components/carouselCard';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import {addFavorite, getVendor, removeFavorite} from '../redux/actions/data';
import ImageView from 'react-native-image-viewing';
import {Fold} from 'react-native-animated-spinkit';
import {Spinner} from '../components/spinner';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export const RestaurantDetailScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedType, setSelectedType] = useState('stamps');
  const [isVisible, setIsVisible] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState(false);
  const [hide, setHide] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const coordinate = useSelector(state => state.auth.location);
  const [vendorData, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullView, setFullView] = useState(false);
  const [fullIndex, setFullIndex] = useState(0);
  const [fullImages, setFullImages] = useState([]);

  const {vendor} = route.params;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (vendor) {
        getData();
      }
    });

    return unsubscribe;
  }, [vendor, navigation]);

  useEffect(() => {
    if (
      vendorData &&
      vendorData?.carousel_images &&
      vendorData?.carousel_images.length > 0
    ) {
      let temp = [];
      vendorData.carousel_images.map(item => {
        temp.push({uri: CAROUSEL_URL + item});
      });
      setFullImages(temp);
    }
  }, [vendorData]);

  const getData = () => {
    setLoading(true);
    getVendor({vendor_id: vendor.id}, token)
      .then(res => {
        setVendor(res);
        if (res.is_favorite_status) {
          setFavorite(true);
        } else {
          setFavorite(false);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err,
        });
      });
  };

  const goBack = () => {
    navigation.goBack();
  };

  const _renderItem = ({item, index}) => {
    const onPress = () => {
      setFullView(true);
      setFullIndex(index);
    };
    return <CarouselCard url={item} key={index} onPress={onPress} />;
  };

  const goDealsDetail = (deal, vendor) => {
    navigation.navigate('DealDetail', {deal, vendor});
  };

  const goStambzDetail = (stamp, vendor) => {
    navigation.navigate('StambzDetail', {stamp, vendor, action: 'collect'});
  };

  const goGiftDetail = (gift, vendor) => {
    navigation.navigate('GiftDetail', {gift, vendor});
  };

  const onShare = () => {
    const shareOptions = {
      title: `Share ${vendorData?.name}`,
      message:
        vendorData?.name +
        '\n' +
        'PHONE : ' +
        vendorData?.phone +
        '\n' +
        'ADDRESS : ' +
        vendorData?.address +
        '\n\n' +
        vendorData?.description,
      url: vendorData?.website,
      filename: vendorData?.name, // only for base64 file in Android
    };
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  const goFavorite = () => {
    if (favorite) {
      removeFavorite(
        {
          type: 'vendor',
          entity_id: vendorData?.id,
        },
        token,
      )
        .then(res => {
          setFavorite(false);
        })
        .catch(err => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err,
          });
        });
    } else {
      addFavorite(
        {
          type: 'vendor',
          entity_id: vendorData?.id,
        },
        token,
      )
        .then(res => {
          setFavorite(true);
        })
        .catch(err => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err,
          });
        });
    }
  };

  return (
    <>
      <Spinner visible={loading} />
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 50,
          left: '7%',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          padding: 4,
          borderRadius: 100,
        }}
        onPress={goBack}>
        <AntIcon name="arrowleft" size={24} color={theme['color-basic-100']} />
      </TouchableOpacity>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: '5%',
          paddingTop: Platform.OS === 'ios' ? 70 : 40,
        }}>
        <View style={styles.headerContainer}>
          <View style={{width: '60%'}}>
            {vendorData?.carousel_images &&
            vendorData?.carousel_images.length > 0 ? (
              <>
                <ImageView
                  images={fullImages}
                  imageIndex={fullIndex}
                  visible={fullView}
                  onRequestClose={() => setFullView(false)}
                />
                <Carousel
                  layout={'default'}
                  data={vendorData?.carousel_images}
                  renderItem={_renderItem}
                  sliderWidth={screenWidth * 0.8 * 0.6}
                  itemWidth={screenWidth * 0.8 * 0.6}
                  inactiveSlideScale={0.9}
                  onSnapToItem={index => {
                    setActiveIndex(index);
                  }}
                />
                <Pagination
                  dotsLength={vendorData?.carousel_images.length}
                  activeDotIndex={activeIndex}
                  containerStyle={{
                    position: 'absolute',
                    width: '90%',
                    bottom: 0,
                  }}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    borderWidth: 3,
                    borderColor: theme['color-basic-100'],
                    backgroundColor: theme['color-basic-100'],
                  }}
                  inactiveDotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    borderWidth: 3,
                    borderColor: theme['color-basic-100'],
                    backgroundColor: 'transparent',
                  }}
                  inactiveDotOpacity={0.8}
                  inactiveDotScale={1}
                />
              </>
            ) : (
              <FastImage
                source={require('../../assets/img/place-image1.png')}
                style={{
                  width: '100%',
                  height: 200,
                  resizeMode: 'cover',
                  borderRadius: 10,
                }}
              />
            )}
          </View>
          <View style={{flexDirection: 'column', marginLeft: 20}}>
            <View style={{marginBottom: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text category="h6" style={{color: theme['color-basic-1000']}}>
                  {vendorData?.vendoraddreses?.length}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsVisible(true);
                  }}>
                  <AntIcon
                    name="arrowright"
                    size={24}
                    color={theme['color-danger-500']}
                    style={{marginLeft: 14}}
                  />
                </TouchableOpacity>
              </View>
              <Text status="primary" category="p2">
                Locations
              </Text>
            </View>
            <View style={{marginVertical: 10}}>
              <Text category="h6" style={{color: theme['color-basic-1000']}}>
                {vendorData?.vendoraddreses[0].working_hours}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text status="primary" category="p2">
                  Open
                </Text>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme['color-success-500'],
                    marginLeft: 5,
                  }}
                />
              </View>
            </View>
            <View style={{marginVertical: 10}}>
              <Text category="h6" style={{color: theme['color-basic-1000']}}>
                {getDistance(
                  coordinate.latitude,
                  coordinate.longitude,
                  vendorData?.latitude,
                  vendorData?.longitude,
                )}
              </Text>
              <Text status="primary" category="p2">
                Closest
              </Text>
            </View>
            <TouchableOpacity style={{marginVertical: 10}} onPress={goFavorite}>
              <AntIcon
                name="heart"
                size={24}
                color={favorite ? theme['color-danger-500'] : 'gray'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={
                !errorAvatar
                  ? {
                      uri:
                        ASSET_URL.replace('{TYPE}', 'vendors') +
                        vendorData?.logo,
                    }
                  : require('../../assets/img/place-avatar.png')
              }
              style={{width: 60, height: 60, borderRadius: 30}}
              onError={() => {
                setErrorAvatar(true);
              }}
            />
            <View style={{marginLeft: 6}}>
              <Text category="h4" style={{color: theme['color-basic-1000']}}>
                {makeShort(vendorData?.name, 16)}
              </Text>
              <Text status="primary" category="p2">
                {makeShort(vendorData?.address, 40)}
              </Text>
            </View>
          </View>
          <View style={{position: 'relative'}}>
            <Text
              status="primary"
              category="p2"
              style={{fontWeight: 'bold', marginTop: 20}}>
              {vendorData?.description}
            </Text>
            <Image
              source={require('../../assets/img/offer1.gif')}
              style={{
                height: 70,
                width: 100,
                resizeMode: 'contain',
                alignSelf: 'flex-end',
                marginTop: -6,
              }}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 10}}>
            <TouchableOpacity
              style={{marginRight: 30}}
              onPress={() => {
                setSelectedType('stamps');
              }}>
              <Text
                category={selectedType === 'stamps' ? 'h6' : 'h6'}
                style={{
                  color:
                    selectedType === 'stamps'
                      ? theme['color-basic-1000']
                      : theme['color-primary-400'],
                }}>
                Stamp Cards ({vendorData?.rewards.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginRight: 30}}
              onPress={() => {
                setSelectedType('gift');
              }}>
              <Text
                category={selectedType === 'gift' ? 'h6' : 'h6'}
                style={{
                  color:
                    selectedType === 'gift'
                      ? theme['color-basic-1000']
                      : theme['color-primary-400'],
                }}>
                Gift Cards ({vendorData?.gift_cards.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedType('deals');
              }}>
              <Text
                category={selectedType === 'deals' ? 'h6' : 'h6'}
                style={{
                  color:
                    selectedType === 'deals'
                      ? theme['color-basic-1000']
                      : theme['color-primary-400'],
                }}>
                Deals ({vendorData?.deals.length})
              </Text>
            </TouchableOpacity>
          </ScrollView>
          {selectedType === 'gift' && (
            <View style={{marginTop: 20}}>
              {vendorData?.gift_cards &&
                vendorData?.gift_cards.map((card, index) => {
                  return (
                    <GiftCard
                      key={index}
                      {...card}
                      onPress={() => goGiftDetail(card, vendorData)}
                    />
                  );
                })}
            </View>
          )}
          {selectedType === 'stamps' && (
            <View style={{marginTop: 20}}>
              {vendorData?.rewards &&
                vendorData?.rewards.map((card, index) => {
                  return (
                    <StampCard
                      key={index}
                      {...card}
                      onPress={() => goStambzDetail(card, vendorData)}
                    />
                  );
                })}
            </View>
          )}
          {selectedType === 'deals' && (
            <View style={{marginTop: 20}}>
              {vendorData?.deals &&
                vendorData?.deals.map((card, index) => {
                  return (
                    <DealsCard
                      {...card}
                      key={index}
                      onPress={() => goDealsDetail(card, vendorData)}
                    />
                  );
                })}
            </View>
          )}
          <View style={styles.detailCard}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text category="h5" style={{color: theme['color-basic-1000']}}>
                Venue Details
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setHide(prev => !prev);
                }}>
                {hide ? (
                  <AntIcon
                    name="down"
                    size={26}
                    color={theme['color-danger-500']}
                  />
                ) : (
                  <AntIcon
                    name="close"
                    size={26}
                    color={theme['color-danger-500']}
                  />
                )}
              </TouchableOpacity>
            </View>
            {!hide && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 5,
                    marginTop: 20,
                  }}>
                  <Text
                    status="primary"
                    style={{fontSize: 16, fontWeight: 'bold'}}>
                    Branch Location
                  </Text>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                      const scheme = Platform.select({
                        ios: 'maps:0,0?q=',
                        android: 'geo:0,0?q=',
                      });
                      const latLng = `${vendorData?.latitude},${vendorData?.longitude}`;
                      const label = vendorData?.name;
                      const url = Platform.select({
                        ios: `${scheme}${label}@${latLng}`,
                        android: `${scheme}${latLng}(${label})`,
                      });
                      Linking.openURL(url);
                    }}>
                    <Text
                      status="primary"
                      style={{fontSize: 16, fontWeight: 'bold'}}>
                      {makeShort(vendorData?.city, 10)},{' '}
                      {vendorData?.country?.code
                        ? vendorData?.country?.code.toUpperCase()
                        : 'DK'}
                    </Text>
                    <IonIcon
                      name="location-sharp"
                      size={24}
                      color={theme['color-primary-500']}
                      style={{marginLeft: 10}}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 5,
                  }}>
                  <Text
                    status="primary"
                    style={{fontSize: 16, fontWeight: 'bold'}}>
                    Phone
                  </Text>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                      if (vendorData?.phone) {
                        Linking.openURL(`tel:${vendorData?.phone}`);
                      }
                    }}>
                    <Text
                      status="primary"
                      style={{fontSize: 16, fontWeight: 'bold'}}>
                      {addSpaceNumber(vendorData?.phone)}
                    </Text>
                    <FontAwesome
                      name="phone"
                      size={22}
                      color={theme['color-primary-500']}
                      style={{marginLeft: 10}}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 5,
                  }}>
                  <Text
                    status="primary"
                    style={{fontSize: 16, fontWeight: 'bold'}}>
                    Website
                  </Text>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                      if (vendorData?.website) {
                        Linking.openURL(vendorData?.website);
                      }
                    }}>
                    <Text
                      status="primary"
                      style={{fontSize: 16, fontWeight: 'bold'}}>
                      {makeShort(vendorData?.website, 20)}
                    </Text>
                    <IonIcon
                      name="earth"
                      size={22}
                      color={theme['color-primary-500']}
                      style={{marginLeft: 10}}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
          {!hide && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -20,
              }}>
              <TouchableOpacity style={styles.social} onPress={onShare}>
                <FontAwesome
                  name="share-alt"
                  size={22}
                  color={theme['color-primary-500']}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.social}
                onPress={() => {
                  if (vendorData?.facebook) {
                    Linking.openURL(vendorData?.facebook);
                  } else {
                    Toast.show({
                      type: 'error',
                      text1: 'Error',
                      text2: 'Sorry, Facebook page not provied!',
                    });
                  }
                }}>
                <FontAwesome
                  name="facebook"
                  size={22}
                  color={theme['color-primary-500']}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.social}
                onPress={() => {
                  if (vendorData?.instagram) {
                    Linking.openURL(vendorData?.instagram);
                  } else {
                    Toast.show({
                      type: 'error',
                      text1: 'Error',
                      text2: 'Sorry, Instagram page not provied!',
                    });
                  }
                }}>
                <FontAwesome
                  name="instagram"
                  size={22}
                  color={theme['color-primary-500']}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={{height: 100}} />
        <View>
          <Modal isVisible={isVisible} style={styles.modal}>
            <View
              style={[
                styles.modalContainer,
                {backgroundColor: theme['color-basic-200']},
              ]}>
              <ScrollView>
                {vendorData?.vendoraddreses &&
                  vendorData?.vendoraddreses.map((item, index) => {
                    return (
                      <LocationCard
                        key={index}
                        {...item}
                        logo={vendorData?.logo}
                      />
                    );
                  })}
              </ScrollView>
            </View>
            <View style={{marginTop: 30, alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  backgroundColor: theme['color-danger-500'],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  setIsVisible(false);
                }}>
                <AntIcon
                  name="close"
                  size={24}
                  color={theme['color-basic-100']}
                />
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  activeCategory: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ebca28',
    borderRadius: 20,
  },
  category: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  detailCard: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.09,
    shadowRadius: 10,

    elevation: 10,
    marginTop: 30,
  },
  social: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  modal: {},
  modalContainer: {
    height: (screenHeight * 3) / 4,
    borderRadius: 20,
    padding: 20,
  },
});
