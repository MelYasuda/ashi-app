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
      console.log("post promise")
      return new Promise((resolve, reject)=>{
      console.log("inside promise")       
        database.ref("Posts/United States/" + upper + "/").on('value', (snapshot) => {
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
            const userRef = database.ref('users');
            userRef.child(uid).on('value',(snapshot) => {
              const username = snapshot.val().username;
              listing["username"] = username;
            })

            listingKeys.push(listingKey);
            listings.push(listing);
          }
        }
      }
      const containerObject = {}
      containerObject["listings"] = listings;
      containerObject["listingKeys"] = listingKeys;
      resolve(containerObject);
      reject(console.log("rejected!"))
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
            const userRef = database.ref('users');
            userRef.child(uid).on('value',(snapshot) => {
              const username = snapshot.val().username;
              listing["username"] = username;
            })
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
          const listing = subValue[subKey];
          const userRef = database.ref('users');
          userRef.child(uid).on('value',(snapshot) => {
            const username = snapshot.val().username;
            listing["username"] = username;
          })
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
      <h1>{this.props.listings.city}</h1>
        <div className='row' style={{paddingLeft: '8%'}}>
          {this.state.results.map((result, index)=> 

              <Listing value={result}/>
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    listings: state.searchQuery,
  };
};

export default connect(mapStateToProps)(Listings);