import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  ReactElement,
  Platform
} from 'react-native'

import PageControl from './PageControl'
import Carousel from './Carousel'
import JobCard from './JobCard.js'

var TOKEN_URL = 'https://test.inploi.me/token';

export default class Home extends Component {

  constructor(props) {
    super(props);

// define state variables
    this.state = {
      loading: true,
      selectedIndex: 0,
      jobs: null
    };

    this.token = null;
    this.page = 1;

// bind methods
    this.fetchJobs = this.fetchJobs.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
    this.renderLoadingView = this.renderLoadingView.bind(this);
    this.renderJob = this.renderJob.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
  }

  componentWillMount() {

    this.authenticateUser();
  }

  fetchJobs() {
    // fetch jobs

    var jobsUrl = 'https://test.inploi.me/jobs/' + this.page +'?token='

    fetch(jobsUrl + this.token, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        // this.jobs = (responseData.browse);
        // concat new jobs with prev ones
        let allJobs = [];
        if (this.state.jobs != null) {
          allJobs = allJobs.concat(this.state.jobs)
        }
        allJobs = allJobs.concat(responseData.browse)

        console.log("JOBS: ", allJobs)

        this.setState({
          loading: false,
          jobs: allJobs
        })
      })
      .done();
  }

  authenticateUser() {

    let credentials = JSON.stringify({
      grant_type: "client_credentials",
      client_id: "taimur.danish@tintash.com",
      client_secret: "dk5j4uafcF9dabEIpjjbOPTP"
    });

    fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: credentials,
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        this.token = responseData.access_token,
        this.fetchJobs();
      })
      .done();
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (this.state.loading !== nextState.loading || this.state.selectedIndex !== nextState.selectedIndex || this.state.jobs !== nextState.jobs) {
      return true;
    }
    return false;
  }



  render() {

    console.log("RENDER!")
    return this.renderJob()
  }

  renderLoadingView() {
    return (
      <View style={[{flex:1, position: 'absolute', top: 0, left: 0, right:0, bottom:0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)'}]}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  }

  //index change for carousel
  handleIndexChange(selectedIndex: number) {
    console.log("HANDLE INDEX CHANGE");
    if (this.state.selectedIndex == selectedIndex) {
      return;
    }

    let state = {
      selectedIndex: selectedIndex
    };

    if (selectedIndex == this.state.jobs.length-1) {
      this.page = this.page + 1;
      state['loading'] = true
      console.log("RENDER JOBS CALLED!");
      this.fetchJobs();
    }
    this.setState(state);
  }

  renderJob() {

    let loadingSpinner = this.state.loading ? this.renderLoadingView() : null
    let count=(this.state.jobs) ? this.state.jobs.length : 0
    console.log("RENDER HOME")
    var margin = 20;
    if (Platform.OS === 'ios') {
      margin = 40;
    }
    return (
        <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
          <PageControl
              style={{margin: 10, marginTop: 20}}
              count={(this.state.jobs) ? this.state.jobs.length : 0}
              selectedIndex={this.state.selectedIndex}/>
          <Carousel
              ref='carousel'
              count={(this.state.jobs) ? this.state.jobs.length : 0}
              selectedIndex={this.state.selectedIndex}
              onSelectedIndexChange={this.handleIndexChange}
              renderCard={this.renderCard}
              style={{backgroundColor: 'transparent', margin: margin, overflow: 'visible'}}
          />
          {loadingSpinner}
          </View>
    );
  }

  // render each card for job
  renderCard(index: number): ReactElement {
    console.log("INDEX: ", index)
    var marginHorizontal = 0;
    if (Platform.OS === 'ios') {
      marginHorizontal = 10
    }

    let currentJob = this.state.jobs[index];
    return (
      <JobCard job={currentJob} style={{marginHorizontal: marginHorizontal}}/>
      );
  }

}

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  loading: {
    textAlign: 'center'
  }
});
