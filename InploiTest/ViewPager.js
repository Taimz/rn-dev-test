'use strict';

const React = require('react');

const {
  View,
  StyleSheet,
  ScrollView,
  ViewPagerAndroid,
  Platform,
} = require('react-native');

type Props = {
  count: number;
  selectedIndex: number;
  onSelectedIndexChange?: (index: number) => void;
  bounces?: boolean;
  children?: any;
  style?: any;
};

type State = {
  width: number;
  height: number;
  selectedIndex: number;
  initialSelectedIndex: number;
  scrollingTo: ?number;
};

class ViewPager extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      selectedIndex: this.props.selectedIndex,
      initialSelectedIndex: this.props.selectedIndex,
      scrollingTo: null,
    };
    (this: any).handleHorizontalScroll = this.handleHorizontalScroll.bind(this);
    (this: any).adjustCardSize = this.adjustCardSize.bind(this);
    (this: any).moveToPage = this.moveToPage.bind(this);
    (this: any).moveToNextPage = this.moveToNextPage.bind(this);
    (this: any).moveToPrevPage = this.moveToPrevPage.bind(this);

  }

  render() {
    if (Platform.OS === 'ios') {
      return this.renderIOS();
    } else {
      return this.renderAndroid();
    }
  }

  renderIOS() {
    return (
      <ScrollView
        ref="scrollview"
        contentOffset={{
         x: this.state.width * this.state.initialSelectedIndex,
         y: 0,
        }}
        style={[styles.scrollview, this.props.style]}
        horizontal={true}
        pagingEnabled={true}
        bounces={!!this.props.bounces}
        scrollsToTop={false}
        onScroll={this.handleHorizontalScroll}
        scrollEventThrottle={100}
        removeClippedSubviews={false}
        automaticallyAdjustContentInsets={false}
        directionalLockEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onLayout={this.adjustCardSize}>
        {this.renderContent()}
      </ScrollView>
    );
  }

  renderAndroid() {
    return (
      <ViewPagerAndroid
        ref="scrollview"
        initialPage={this.state.initialSelectedIndex}
        onPageSelected={this.handleHorizontalScroll}
        style={[styles.container]}>
        {this.renderContent()}
      </ViewPagerAndroid>
    );
  }

  adjustCardSize(e: any) {
    this.setState({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    ////console.log("componentWillReceiveProps")
    ////console.log("selectedIndex: " , this.state.selectedIndex);
    ////console.log("nextProps: " , nextProps.selectedIndex);
    if (nextProps.selectedIndex !== this.state.selectedIndex) {
      ////console.log('CALLING SETSTATE');
      this.setState({selectedIndex: nextProps.selectedIndex, scrollingTo: null});
      if (Platform.OS === 'ios') {
        this.refs.scrollview.scrollTo({
          x: nextProps.selectedIndex * this.state.width,
          animated: true,
        });
        this.setState({scrollingTo: nextProps.selectedIndex});
      } else {
        this.refs.scrollview.setPage(nextProps.selectedIndex);
        this.setState({selectedIndex: nextProps.selectedIndex});
      }
    }
  }

  moveToPage(nextIndex: number) {
    // ////console.log('Index: ' , this.state.selectedIndex);
    // ////console.log('Next Index: ' , nextIndex);
    // this.setState({selectedIndex: nextIndex, scrollingTo: null});
    const {onSelectedIndexChange} = this.props;
    onSelectedIndexChange && onSelectedIndexChange(nextIndex);
  }

  moveToNextPage() {
    // ////console.log("VIEWPAGER NEXT");
    if (this.props.selectedIndex < this.props.count-1) {
      this.moveToPage(this.props.selectedIndex + 1);
    }
  }

  moveToPrevPage() {
    if (this.props.selectedIndex > 0) {
      this.moveToPage(this.props.selectedIndex - 1);
    }
  }

  renderContent(): Array<ReactElement> {
    var {width, height} = this.state;
    var style = Platform.OS === 'ios' && styles.card;
    return React.Children.map(this.props.children, (child, i) => (
      <View style={[style, {width, height}]} key={'r_' + i}>
        {child}
      </View>
    ));
  }

  handleHorizontalScroll(e: any) {
    var selectedIndex = e.nativeEvent.position;
    if (selectedIndex === undefined) {
      selectedIndex = Math.round(
        e.nativeEvent.contentOffset.x / this.state.width,
      );
    }
    if (selectedIndex < 0 || selectedIndex >= this.props.count) {
      return;
    }
    if (this.state.scrollingTo !== null && this.state.scrollingTo !== selectedIndex) {
      return;
    }
    if (this.props.selectedIndex !== selectedIndex || this.state.scrollingTo !== null) {
      this.setState({selectedIndex, scrollingTo: null});
      const {onSelectedIndexChange} = this.props;
      onSelectedIndexChange && onSelectedIndexChange(selectedIndex);
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: 'transparent',
  }
});

module.exports = ViewPager;
