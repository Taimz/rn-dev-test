import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  ReactElement,
} from 'react-native'
import Carousel from './Carousel'
import JobCard from './JobCard.js'

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';
var TOKEN_URL = 'https://test.inploi.me/token';

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      selectedIndex: 0,
      fetched: false,
      jobs: null
    };

    this.token = null;
    this.page = 1;
    this.fetchJobs = this.fetchJobs.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderLoadingView = this.renderLoadingView.bind(this);
    this.renderJob = this.renderJob.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.handleIndexChange = this.handleIndexChange.bind(this);
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchJobs() {

    
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

  fetchData() { 
    
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



  render() {
    console.log("RENDER!")
    // if (this.state.loading) {
    //   return this.renderLoadingView();
    // }
    // var job = this.jobs[0];
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

  handleIndexChange(selectedIndex: number) {
    this.setState({
      selectedIndex: selectedIndex
    })
    if (selectedIndex == this.state.jobs.length-1) {
      this.page = this.page + 1;
      this.setState({
        loading: true
      });
      this.fetchJobs();
    }
  }

  renderJob() {
    let loadingSpinner = this.state.loading ? this.renderLoadingView() : null
    let count=(this.state.jobs) ? this.state.jobs.length : 0
    console.log("COUNT: ", count)
    return (        
        <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
          <Carousel
              ref='carousel'
              count={(this.state.jobs) ? this.state.jobs.length : 0}
              selectedIndex={this.state.selectedIndex}
              onSelectedIndexChange={this.handleIndexChange}
              renderCard={this.renderCard}
              style={{backgroundColor: 'transparent', margin: 40}}
          />
          {loadingSpinner}
          </View>
    );
  }

  renderCard(index: number): ReactElement {
    let currentJob = this.state.jobs[index];
    return (
      <JobCard job={currentJob} style={{marginHorizontal: 10}}/>
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