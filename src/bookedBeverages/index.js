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
import styles from '../bookedBeverages/style';
import {useFocusEffect} from '@react-navigation/native';

export default function BookedBeverages() {
  const [bookmarkedBeers, setBookmarkedBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(() => {
    console.log('BookedBeverages focused');
    if (!dataLoaded) {
      loadBookmarks();
    }

    return () => {
      console.log('BookedBeverages unfocused');
    };
  }, [dataLoaded]);

  const onRefresh = () => {
    setRefreshing(true);
    loadBookmarks();
    setRefreshing(false);
  };

  const loadBookmarks = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      if (bookmarks) {
        const bookmarkedBeerIds = JSON.parse(bookmarks);
        const bookmarkedBeersData = await Promise.all(
          bookmarkedBeerIds.map(async beerId => fetchBeerDetailsById(beerId)),
        );
        setBookmarkedBeers(bookmarkedBeersData);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBeerDetailsById = async id => {
    try {
      const response = await fetch(`https://api.punkapi.com/v2/beers/${id}`);
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Error fetching beer details:', error);
      return null;
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.image_url}} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.tagline}>{item.tagline}</Text>
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
        {!loading && bookmarkedBeers.length === 0 && (
          <Text style={styles.beerText}>No bookmarked beers found.</Text>
        )}
        {bookmarkedBeers.length > 0 && (
          <FlatList
            data={bookmarkedBeers}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        )}
      </View>
    </ScrollView>
  );
}
