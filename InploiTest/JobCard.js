import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  Dimensions
} from 'react-native';

  var width = Dimensions.get('window').width; 
  var height = Dimensions.get('window').height;

export default class JobCard extends Component {

  renderJobTerm(term) {
    if (term == "ft") {
      return <Text style={styles.year}>. Full Term</Text>
    }
    if (term == "ht") {
      return <Text style={styles.year}>. Half Term</Text>
    }
  }

	render() {

    let coverUri = 'https://res.cloudinary.com/chris-mackie/image/upload/g_face/v' + this.props.job.company_img_v + '/' + this.props.job.company_img;
    let employerUri = 'https://res.cloudinary.com/chris-mackie/image/upload/c_thumb/v' + this.props.job.employer_img_v + '/' + this.props.job.employer_img;

		return (
		    <View style={[styles.mainContainer, this.props.style]}>
          <View style={[styles.imageContainer]}>
            <Image
              resizeMode= 'cover'
              source={{uri: coverUri}}
              style={[styles.cover]}
            />
          </View>
          <View style={[styles.bottomContainer]}>
              <Text style={styles.title}>{this.props.job.role}</Text>
              <Text style={styles.subtitle}>{this.props.job.company}</Text>
              <Text style={styles.description} numberOfLines={2}>{this.props.job.full_description}</Text>
              <Text style={styles.year}>. {this.props.job.company_type}</Text>
              {this.props.job.job_term == 'ft' ? this.renderJobTerm('ft') : this.renderJobTerm('ht') }
              <Text style={styles.year}>. {this.props.job.address}</Text>
              <Text style={styles.year}>. ${this.props.job.rate} {this.props.job.rate_type}</Text>
          </View>
          <Image
            source={{uri: employerUri}}
            style={[styles.employer_image]}
          />
        </View>
      )
	}
}

var styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 1,
    },
    imageContainer: { 
      flex: 0.5, 
    },
    thumbnail: { 
      width: 53, 
      height: 81, 
    },
    cover: {
      flex: 0.5,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    bottomContainer: { 
      flex: 0.5,
      marginHorizontal: 20,
      justifyContent: 'center'
    },
    title: { 
      fontSize: 28, 
      marginBottom: 0, 
      textAlign: 'left',
    }, 
    subtitle: {
      textAlign: 'left', 
      fontSize: 20,
      marginBottom: 10,
    },
    description: { 
      textAlign: 'left', 
      marginBottom: 4,
      marginRight: 30,
    },
    year: { 
      textAlign: 'left', 
    },
    listView: {
      paddingTop: 20,
      backgroundColor: '#F5FCFF',
    },
    employer_image: {
      width: 75,
      height: 75,
      right: 15,
      bottom: (height-75-80)/2,
      borderRadius: 37.5,
      position: 'absolute'
    }
  });