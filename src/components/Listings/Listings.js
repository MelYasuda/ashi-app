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

    const searchQuery = this.props.listings.city;
    const upper = searchQuery.replace(/^\w/, c => c.toUpperCase());

    const posts =  () => {
      return new Promise((resolve, reject)=>{database.ref("Posts/United States/" + upper + "/").on('value',  (snapshot) => {
      let value = snapshot.val();
      if (!value){
        database.ref("Posts/Canada/" + upper + "/").on('value',  (snapshot) =>{
          value = snapshot.val()
        })
      }
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
      console.log(containerObject)
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
              if((listing["Location Preffered"]===upper || listing["CityName"]===upper) && !containerObject["listingKeys"].includes(listingKey) ){
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
          if((listing["Location Preffered"]===upper || listing["CityName"]===upper) && !containerObject["listingKeys"].includes(subKey)){
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
          <h1>{this.props.listings.city}</h1>
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
    listings: state.searchQuery,
  };
};

export default connect(mapStateToProps)(Listings);