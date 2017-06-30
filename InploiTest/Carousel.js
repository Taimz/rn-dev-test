'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Platform
} from 'react-native';

const ViewPager = require('./ViewPager');
// const StyleSheet = require('F8StyleSheet');

type Props = {
  count: number;
  selectedIndex: number;
  onSelectedIndexChange?: (index: number) => void;
  renderCard: (index: number) => ReactElement;
  style?: any;
};

class Carousel extends React.Component {
  props: Props;

  constructor(props) {
    super(props)

    this.moveToNextPage = this.moveToNextPage.bind(this);
    this.moveToPrevPage = this.moveToPrevPage.bind(this);
  }

  render() {
    let cards = [];
    const {count, selectedIndex, renderCard} = this.props;

    for (let i = 0; i < count; i++) {
      let content = null;
      if (Math.abs(i - selectedIndex) < 2) {
        content = renderCard(i);
      }
      cards.push(content);
    }

    var style;
    if (Platform.OS === 'ios') {
      style = styles.carouseliOS;
    } else {
      style = styles.carouselAndroid;
    }
    return (
      <ViewPager style={style} {...this.props} bounces={true} count={this.props.count} ref='viewPager'>
        {cards}
      </ViewPager>
    );
  }

  moveToNextPage() {
    ////console.log("Carousel NEXT");
    this.refs.viewPager.moveToNextPage();
  }

  moveToPrevPage() {
    this.refs.viewPager.moveToPrevPage();
  }

}

var styles = StyleSheet.create({
  carouseliOS: {
      // margin: 15,
      // marginHorizontal: 22,
      // marginBottom: 40,
      // overflow: 'visible',
      // backgroundColor: 'black',
  },
  carouselAndroid: {
    margin: 20,
    overflow: 'visible',
  }
});

module.exports = Carousel;
