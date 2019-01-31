import React from 'react';
import * as firebase from 'firebase';
import Listing from './Listing';
import { connect } from 'react-redux';

class Listings extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      results: null,
      isLoading: true,

    }

    const database = firebase.database();

    const searchQuery = this.props.listings;
    console.log(searchQuery);

    const posts =  () => {
      return new Promise((resolve, reject)=>{database.ref("Posts/" + searchQuery.country + "/" + searchQuery.city + "/").on('value',  (snapshot) => {
      const value = snapshot.val();
      const listings = [];
      const listingKeys = [];
      for(const uid in value) {
        const subValue = value[uid];
        for(const categoryKey in subValue){
          const subSubValue = subValue[categoryKey];
          for(const listingKey in subSubValue) {
            const listing = subSubValue[listingKey];
            listingKeys.push(listingKey);
            listings.push(listing);
          }
        }
      }
      const containerObject = {}
      containerObject["listings"] = listings;
      containerObject["listingKeys"] = listingKeys;
      resolve(containerObject)
    })
  })}

    const newPosts = (containerObject) => {
      return new Promise((resolve, reject)=>{database.ref("NewPosts/").on('value',  (snapshot) => {
      const value = snapshot.val();
      for(const uid in value) {
        const subValue = value[uid];
        for(const categoryKey in subValue){
          const subSubValue = subValue[categoryKey];
          for(const listingKey in subSubValue) {
            const listing = subSubValue[listingKey]
              if((listing["Location Preffered"]===searchQuery.country || listing["CityName"]===searchQuery.city) && !containerObject["listingKeys"].includes(listingKey) ){
                containerObject["listings"].push(listing);
            }
          }
        }
      }
      resolve(containerObject)
    })
  })}

const reservePost = (containerObject) => {
  return new Promise((resolve, reject)=>{database.ref("ReservePost/").on('value',  (snapshot) => {
    const value = snapshot.val();
    for(const uid in value) {
      const subValue = value[uid];
      for(const subKey in subValue){
          const listing = subValue[subKey]
          if((listing["Location Preffered"]===searchQuery.country || listing["CityName"]===searchQuery.city) && !containerObject["listingKeys"].includes(subKey)){
            containerObject["listings"].push(listing);
          }
      }
    }
    this.setState({results: containerObject["listings"]})
    resolve()
  })
})
}

  const setLoadingState = () => {
    this.setState( {isLoading: false} )
  }

  posts().then(newPosts).then(reservePost).then(setLoadingState);

  //end of constructor
  }

  render(){
    if(this.state.isLoading) return null;
    return(
      <div className='container'>
        <div className='row' style={{paddingLeft: '8%'}}>
          <h1>Boston</h1>
          {this.state.results.map((result, index)=> 

              <Listing value={result}/>
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    listings: state.listings.searchQuery,
  };
};

export default connect(mapStateToProps)(Listings);