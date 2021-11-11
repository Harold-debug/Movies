// Components/Search.js

import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import FilmItem from "./FilmItem";
import FilmList from "./FilmList";
import { getFilmsFromApiWithSearchedText } from "../API/TMDBApi";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.searchedText = "";
    this.page = 0;
    this.totalPages = 0;
    this.state = {
      films: [],
      isLoading: false,
    };
  }

  _loadFilms() {
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true });
      getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1).then(
        (data) => {
          this.page = data.page;
          this.totalPages = data.total_pages;
          this.setState({
            films: [...this.state.films, ...data.results],
            isLoading: false,
          });
        }
      );
    }
  }

  _searchTextInputChanged(text) {
    this.searchedText = text;
  }

  _searchFilms() {
    this.page = 0;
    this.totalPages = 0;
    this.setState(
      {
        films: [],
      },
      () => {
        this._loadFilms();
      }
    );
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.main_container}>
        <View style={[styles.main_container, { marginTop: 20 }]}>
          <TextInput
            style={styles.textinput}
            placeholder="Titre du film"
            onChangeText={(text) => this._searchTextInputChanged(text)}
            onSubmitEditing={() => this._searchFilms()}
          />
          <Button title="Rechercher" onPress={() => this._searchFilms()} />
          <FilmList
            films={this.state.films}
            navigation={this.props.navigation}
            loadFilms={this._loadFilms}
            page={this.page}
            totalPages={this.totalPages}
          />
          {this._displayLoading()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: "#000000",
    borderWidth: 1,
    paddingLeft: 5,
  },
  loading_container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Search;
