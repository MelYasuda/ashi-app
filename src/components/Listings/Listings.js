import React from 'react';
import * as firebase from 'firebase';
import Listing from './Listing';

class Listings extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      results: null,
      isLoading: true,
      searchQuery: {
        country: null,
        city: null
      }
    }

    const database = firebase.database();

    const posts =  () => {
      return new Promise((resolve, reject)=>{database.ref("Posts/United States/Boston/").on('value',  (snapshot) => {
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
              if((listing["Location Preffered"]==="Boston" || listing["CityName"]==="Boston") && !containerObject["listingKeys"].includes(listingKey) ){
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
          if((listing["Location Preffered"]==="Boston" || listing["CityName"]==="Boston") && !containerObject["listingKeys"].includes(subKey)){
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



export default Listings;