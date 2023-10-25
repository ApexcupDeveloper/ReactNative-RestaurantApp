import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Avatar, useTheme, Text, Divider} from '@ui-kitten/components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ASSET_URL} from '../api/constant';
import {makeShort} from '../utils/makeShort';
import {getDistance} from '../utils/getDistance';
import {useSelector} from 'react-redux';

export const StambzCard = ({
  id,
  vendor_category_id,
  main_image,
  logo,
  name,
  address,
  rewards,
  deals,
  gift_cards,
  distance_in_km,
  latitude,
  longitude,
  user_rewards,
  user_gift_cards,
  rewards_ready,
  rewards_in_progress,
  gift_cards_active,
  onPress,
  onPressSee,
}) => {
  const theme = useTheme();
  const coordinate = useSelector(state => state.auth.location);
  const IMG_URL = ASSET_URL.replace('{TYPE}', 'vendors');
  const [errorImage, setErrorImage] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {backgroundColor: theme['color-basic-100']},
      ]}
      onPress={onPress}>
      <FastImage
        source={{uri: IMG_URL + main_image}}
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          width: '100%',
          height: 150,
        }}
        resizeMode={FastImage.resizeMode.cover}
        onError={() => {
          setErrorImage(true);
        }}
      />
      <View style={styles.distance}>
        <Text status="danger" style={{fontWeight: 'bold'}}>
          {getDistance(
            coordinate.latitude,
            coordinate.longitude,
            latitude,
            longitude,
          )}
        </Text>
      </View>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Avatar
          source={
            !errorAvatar
              ? {uri: IMG_URL + logo}
              : require('../../assets/img/place-avatar.png')
          }
          size="giant"
          onError={() => {
            setErrorAvatar(true);
          }}
        />
        <View style={{marginLeft: 10}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 6,
            }}>
            <Text category="h5" style={{color: theme['color-basic-1000']}}>
              {makeShort(name, 16)}
            </Text>
            <View
              style={[
                styles.online,
                {backgroundColor: theme['color-success-500']},
              ]}
            />
          </View>
          <Text status="primary" category="c1">
            {makeShort(address, 40)}
          </Text>
        </View>
      </View>
      <Divider style={{backgroundColor: theme['color-primary-100']}} />
      <View style={{paddingVertical: 5, paddingHorizontal: 10}}>
        {rewards && rewards.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 2,
            }}>
            <Text
              category="c2"
              style={{color: theme['color-primary-500'], width: '50%'}}>
              {makeShort(rewards[0].title, 30)}
            </Text>
            <Text
              category="c2"
              style={{color: theme['color-basic-100'], marginHorizontal: 3}}>
              Prepaid Card
            </Text>
            {rewards[0].used_count === 0 ? (
              <Pressable
                style={{
                  backgroundColor: theme['color-basic-100'],
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 15,
                  borderColor: theme['color-primary-400'],
                  borderWidth: 1,
                }}
                onPress={() => onPressSee(rewards[0])}>
                <Text category="c2" status="primary">
                  See it
                </Text>
              </Pressable>
            ) : (
              <View
                style={{
                  backgroundColor: theme['color-primary-500'],
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 15,
                  borderColor: theme['color-primary-500'],
                  borderWidth: 1,
                }}>
                <Text category="c2">
                  {rewards[0].used_count} of {rewards[0]?.total_stambz}
                </Text>
              </View>
            )}
            {rewards_ready &&
              rewards_ready.length > 0 &&
              rewards_ready.filter(reward => reward.reward.id === rewards[0].id)
                .length > 0 && (
                <View style={{width: 20}}>
                  <FontAwesome
                    name="gift"
                    size={20}
                    color={theme['color-danger-500']}
                  />
                </View>
              )}
          </View>
        )}
        {rewards && rewards.length > 1 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 2,
            }}>
            <Text
              category="c2"
              style={{color: theme['color-primary-500'], width: '50%'}}>
              {makeShort(rewards[1].title, 30)}
            </Text>
            <Text
              category="c2"
              style={{color: theme['color-basic-100'], marginHorizontal: 3}}>
              Prepaid Card
            </Text>
            {rewards[1].used_count === 0 ? (
              <Pressable
                style={{
                  backgroundColor: theme['color-basic-100'],
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 15,
                  borderColor: theme['color-primary-400'],
                  borderWidth: 1,
                }}
                onPress={() => onPressSee(rewards[1])}>
                <Text category="c2" status="primary">
                  See it
                </Text>
              </Pressable>
            ) : (
              <View
                style={{
                  backgroundColor: theme['color-primary-500'],
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 15,
                  borderColor: theme['color-primary-500'],
                  borderWidth: 1,
                }}>
                <Text category="c2">
                  {rewards[1].used_count} of {rewards[1]?.total_stambz}
                </Text>
              </View>
            )}
            {rewards_ready &&
              rewards_ready.length > 0 &&
              rewards_ready.filter(reward => reward.reward.id === rewards[1].id)
                .length > 0 && (
                <View style={{width: 20}}>
                  <FontAwesome
                    name="gift"
                    size={20}
                    color={theme['color-danger-500']}
                  />
                </View>
              )}
          </View>
        )}

        {/* {rewards_in_progress && rewards_in_progress.length > 0 ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 2 }}>
                        <Text category='c2' style={{ color: theme["color-primary-500"], width: '50%' }}>{makeShort(rewards_in_progress[0].reward?.title, 30)}</Text>
                        <Text category='c2' style={{ color: theme["color-basic-100"], marginHorizontal: 3 }}>Prepaid Card</Text>
                        {rewards_in_progress[0].used_count === 0 ? (
                            <Pressable style={{ backgroundColor: theme["color-basic-100"], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15, borderColor: theme["color-primary-400"], borderWidth: 1 }} onPress={() => onPressSee(rewards_in_progress[0])}>
                                <Text category='c2' status='primary' >See it</Text>
                            </Pressable>
                        ) : (
                            <View style={{ backgroundColor: theme["color-primary-500"], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15, borderColor: theme["color-primary-500"], borderWidth: 1 }}>
                                <Text category='c2'>{rewards_in_progress[0].used_count} of {rewards_in_progress[0].reward?.total_stambz}</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <>
                        {rewards && rewards.length > 0 && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 2 }}>
                                <Text category='c2' style={{ color: theme["color-primary-500"], width: '50%' }}>{makeShort(rewards[0].title, 30)}</Text>
                                <Text category='c2' style={{ color: theme["color-basic-100"], marginHorizontal: 3 }}>Prepaid Card</Text>
                                {rewards[0].used_count === 0 ? (
                                    <Pressable style={{ backgroundColor: theme["color-basic-100"], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15, borderColor: theme["color-primary-400"], borderWidth: 1 }} onPress={() => onPressSee(rewards[0])}>
                                        <Text category='c2' status='primary' >See it</Text>
                                    </Pressable>
                                ) : (
                                    <View style={{ backgroundColor: theme["color-primary-500"], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15, borderColor: theme["color-primary-500"], borderWidth: 1 }}>
                                        <Text category='c2'>{rewards[0].used_count} of {rewards[0]?.total_stambz}</Text>
                                    </View>
                                )}
                                {rewards_ready && rewards_ready.length > 0 && rewards_ready.filter(reward => reward.reward.id === rewards[0].id).length > 0 && (
                                    <View style={{ width: 20 }}>
                                        <FontAwesome name='gift' size={20} color={theme["color-danger-500"]} />
                                    </View>
                                )}
                            </View>
                        )}
                    </>
                )} */}

        {/* {rewards_ready && rewards_ready.length > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 2 }}>
                        <Text category='c2' style={{ color: theme["color-primary-500"], width: '50%' }}>{makeShort(rewards_ready[0].reward?.title, 30)}</Text>
                        <Text category='c2' style={{ color: theme["color-basic-100"], marginHorizontal: 3 }}>Prepaid Card</Text>
                        <Pressable style={{ backgroundColor: theme["color-basic-100"], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 15, borderColor: theme["color-primary-300"], borderWidth: 1 }} onPress={onPressSee}>
                            <Text category='c2' status='primary' >See it</Text>
                        </Pressable>
                        <View style={{ width: 20 }}>
                            <FontAwesome name='gift' size={20} color={theme["color-danger-500"]} />
                        </View>
                    </View>
                )} */}
        {gift_cards_active && gift_cards_active.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 2,
            }}>
            <Text
              category="c2"
              style={{color: theme['color-primary-500'], width: '50%'}}>
              {makeShort(gift_cards_active[0].gift_card?.title, 30)}
            </Text>
            <Text
              category="c2"
              style={{color: theme['color-danger-500'], marginHorizontal: 3}}>
              Prepaid Card
            </Text>
            {gift_cards_active[0].used_count !== 0 ? (
              <View
                style={{
                  backgroundColor: theme['color-danger-500'],
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 15,
                  borderColor: theme['color-danger-500'],
                  borderWidth: 1,
                }}>
                <Text
                  category="c2"
                  status="primary"
                  style={{color: theme['color-basic-100']}}>
                  {gift_cards_active[0].total_items -
                    gift_cards_active[0].used_count}{' '}
                  left
                </Text>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: theme['color-basic-100'],
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 15,
                  borderColor: theme['color-danger-500'],
                  borderWidth: 1,
                }}>
                <Text category="c2" status="primary">
                  {gift_cards_active[0].gift_card?.price}Kr.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {gift_cards && gift_cards.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 2,
                }}>
                <Text
                  category="c2"
                  style={{color: theme['color-primary-500'], width: '50%'}}>
                  {makeShort(gift_cards[0].title, 30)}
                </Text>
                <Text
                  category="c2"
                  style={{
                    color: theme['color-danger-500'],
                    marginHorizontal: 3,
                  }}>
                  Prepaid Card
                </Text>
                {gift_cards[0].used_count !== 0 ? (
                  <View
                    style={{
                      backgroundColor: theme['color-danger-500'],
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 15,
                      borderColor: theme['color-danger-500'],
                      borderWidth: 1,
                    }}>
                    <Text
                      category="c2"
                      status="primary"
                      style={{color: theme['color-basic-100']}}>
                      {gift_cards[0].items - gift_cards[0].used_count} left
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: theme['color-basic-100'],
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 15,
                      borderColor: theme['color-danger-500'],
                      borderWidth: 1,
                    }}>
                    <Text category="c2" status="primary">
                      {gift_cards[0]?.price}Kr.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  distance: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    backgroundColor: 'white',
    position: 'absolute',
    top: 10,
    right: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  online: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 5,
  },
});
