import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './style';
export default function userDetails() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData(page);
    loadBookmarks();
  }, []);

  const fetchData = async page => {
    try {
      const response = await fetch(
        `https://reqres.in/api/users?page=${page}&per_page=6`,
      );
      const data = await response.json();

      // Initialize bookmarked status from AsyncStorage
      const bookmarkedUsers = await loadBookmarks();
      const usersWithBookmarks = data.data.map(user => ({
        ...user,
        bookmarked: bookmarkedUsers.includes(user.id.toString()),
      }));

      setUsers(prevData => [...prevData, ...usersWithBookmarks]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleBookmark = async id => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? {...user, bookmarked: !user.bookmarked} : user,
      ),
    );
    updateBookmarks(id);
  };

  const updateBookmarks = async id => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      let bookmarkedUsers = bookmarks ? JSON.parse(bookmarks) : [];

      if (bookmarkedUsers.includes(id.toString())) {
        bookmarkedUsers = bookmarkedUsers.filter(
          beerId => beerId !== id.toString(),
        );
      } else {
        bookmarkedUsers.push(id.toString());
      }

      await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarkedUsers));
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
      <Image source={{uri: item.avatar}} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>
          Name: {`${item.first_name} ${item.last_name}`}
        </Text>
        <Text style={styles.tagline}>Email: {item.email}</Text>
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
        data={users}
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
