import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import styles from './style';
import {useFocusEffect} from '@react-navigation/native';

export default function favouriteUsers() {
  const [bookmarked, setBookmarked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookmarks = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      if (bookmarks) {
        const bookmarkedIds = JSON.parse(bookmarks);
        const bookmarkedData = await Promise.all(
          bookmarkedIds.map(async beerId => fetchDetailsById(beerId)),
        );
        setBookmarked(bookmarkedData.filter(beer => beer !== null));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadBookmarks();
      return () => {};
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadBookmarks();
    setRefreshing(false);
  };

  const fetchDetailsById = async userId => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${userId}`);
      const data = await response.json();

      if (data && data.data) {
        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.avatar}} style={styles.image} />
      <View style={styles.textContainer}>
        <Text
          style={styles.name}>{`${item.first_name} ${item.last_name}`}</Text>
        <Text style={styles.tagline}>{item.email}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {!loading && bookmarked.length === 0 && (
          <Text style={styles.beerText}>No Favourite Users Found.</Text>
        )}
        {bookmarked.length > 0 && (
          <FlatList
            data={bookmarked}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        )}
      </View>
    </ScrollView>
  );
}
