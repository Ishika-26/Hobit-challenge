import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import styles from '../listofBeverages/style';

export default function ListOfBeverages() {
  const [beers, setBeers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData(page);
    loadBookmarks();
  }, []);

  const fetchData = async page => {
    try {
      const response = await fetch(
        `https://api.punkapi.com/v2/beers?page=${page}&per_page=10`,
      );
      const data = await response.json();
      // Initialize bookmarked status from AsyncStorage
      const bookmarkedBeers = await loadBookmarks();
      const beersWithBookmarks = data.map(beer => ({
        ...beer,
        bookmarked: bookmarkedBeers.includes(beer.id.toString()),
      }));
      // setBeers(beersWithBookmarks);
      setBeers(prevData => [...prevData, ...beersWithBookmarks]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleBookmark = async id => {
    setBeers(prevBeers =>
      prevBeers.map(beer =>
        beer.id === id ? {...beer, bookmarked: !beer.bookmarked} : beer,
      ),
    );
    updateBookmarks(id);
  };

  const updateBookmarks = async id => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      let bookmarkedBeers = bookmarks ? JSON.parse(bookmarks) : [];

      if (bookmarkedBeers.includes(id.toString())) {
        bookmarkedBeers = bookmarkedBeers.filter(
          beerId => beerId !== id.toString(),
        );
      } else {
        bookmarkedBeers.push(id.toString());
      }

      await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarkedBeers));
    } catch (error) {
      console.error('Error updating bookmarks:', error);
    }
  };

  const loadBookmarks = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.image_url}} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.tagline}>{item.tagline}</Text>
      </View>
      <TouchableOpacity
        onPress={() => toggleBookmark(item.id)}
        style={{padding: 10}}>
        <Image
          source={
            item.bookmarked
              ? require('../../src/images/bookmark.png')
              : require('../../src/images/save.png')
          }
          style={styles.bookmarkIcon}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <FlatList
        data={beers}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => {
          console.log('flatlist end');
          const index = 1 + page;
          fetchData(index);
          setPage(prevPage => prevPage + 1);
        }}
      />
    </View>
  );
}
