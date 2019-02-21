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

    let country = null;
    let city = null;

    const americaListings = () => {
      return new Promise((resolve,reject)=>{
        database.ref("Posts/United States/" + upper + "/").on('value', (snapshot) => {
          let value = snapshot.val();
          country = 'United States';
          city = upper;
          resolve(value)
        })
      })
    }

    const canadaListings = (canadaValue) => {
      return new Promise((resolve,reject)=>{
        if (canadaValue===null){
          database.ref("Posts/Canada/" + upper + "/").on('value',  (snapshot) =>{
            canadaValue = snapshot.val();
            // canadaValue['city'] = upper;
            resolve(canadaValue)
          })
        } else{
          resolve(canadaValue)
        }
      })
    }

    const posts = (value) => {
      const listings = [];
      for(const uid in value) {
        const subValue = value[uid];
        for(const categoryKey in subValue){
          const subSubValue = subValue[categoryKey];
          for(const listingKey in subSubValue) {
       listings.push(new Promise((resolve, reject)=>{

            const listing = subSubValue[listingKey];
            const userRef = database.ref('users');
            userRef.child(uid).on('value',(snapshot) => {
              const username = snapshot.val().username;
              listing["username"] = username;
            })
            if(categoryKey==="Roommate"){
              listing["category"] = 0
              } else if (categoryKey==="Solo Apartments"){
              listing["category"] = 1
              } else {
              listing["category"] = 2
              }
            listing['country'] = country;
            listing['city'] = city;
            listing["listingKey"] = listingKey;
            // (will)decide whether the listing is saved or not by refrering to user saves
            console.log(listing)
            resolve(listing)
          })
          )
          }
        }

}
return Promise.all(listings)
}

  const readSavedListings = (listings) => {
    return new Promise((resolve,reject)=>{
      const currentUid = firebase.auth().currentUser.uid;
      firebase.database().ref(`users/${currentUid}/saved`).on('value', snapshot => {
        const savedListings = snapshot.val();
        console.log(savedListings)
        const containerObject = {}
        containerObject['listings'] = listings;
        containerObject['savedListings'] = savedListings;
        resolve(containerObject)
      })
    })
  }

  const collectSavedListingIds = (savedListings) => {
    const savedListingIds = []
    for(let savedListing in savedListings){
      savedListingIds.push(savedListings[savedListing].listingId)
    }
    return savedListingIds
  }

  const checkSavedListings = (containerObject) => {
      const {listings, savedListings} = containerObject;

      const savedListingIds = collectSavedListingIds(savedListings);
      console.log(savedListingIds)

      const checkedSavedListings = [];
      listings.map(listing => {
          checkedSavedListings.push(new Promise((resolve, reject) =>{
            if(savedListingIds.includes(listing.listingKey)){
              listing['saved']=true;
              resolve(listing)
            } else {
              listing['saved']=false;
              resolve(listing)
            }
          })
          )
        })
      console.log(checkedSavedListings)
      return Promise.all(checkedSavedListings)
  }


  const categoryKey = (listings) => {
    console.log(listings)
    return new Promise((resolve,reject) => {
      const containerObject = {
        masterData:[
        {
          category: "Roommate",
          data: []
        },
        {
          category: "Solo Apartments",
          data: []
        },
        {
          category: "Shared Apartments",
          data: []
        },
        ]
      };
      listings.map(listing => {
        containerObject.masterData[listing.category].data.push(listing)
        return null
      })
      

      resolve(containerObject);
      this.setState({results: containerObject["masterData"]})

    })
  }

  const setLoadingState = () => {
    this.setState( {isLoading: false} )
  }

  americaListings().then(canadaListings).then(posts).then(readSavedListings).then(checkSavedListings).then(categoryKey).then(setLoadingState);

  //end of constructor
  }

  toggleSaveButton = (listingKey) => {
    let newState = Object.assign({}, this.state)
    console.log(newState.results);
    newState.results.map(result =>{
      const data = result.data;
      data.map(listing=>{
        if(listing.listingKey===listingKey){
          listing.saved = true;
        }
      })
    })
    this.setState({newState})
  }

  render(){
    console.log(this.state.results)
    if(this.state.isLoading) return null;
    return(
      <div className='container'>
      <h1>{this.props.listings.city}</h1>
      {
        this.state.results.map( (result, index) => (
          <div key={index}>
            <h2>{result.category} {result.data.length}</h2>
            <div className='row' style={{paddingLeft: '8%'}}>
            {result.data.map((value, index)=> 
                <Listing key={index} 
                value={value} 
                saved={value.saved}
                history={this.props.history}
                toggleSaveButton={this.toggleSaveButton}
                />
              )}
            </div>          
          </div>
         ) )
      }
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


// Reading data from NewPosts and ReservePost but not using the data
//     const newPosts = (containerObject) => {
//       return new Promise((resolve, reject)=>{database.ref("NewPosts/").on('value',  (snapshot) => {
//       const value = snapshot.val();
//       for(const uid in value) {
//         const subValue = value[uid];
//         for(const categoryKey in subValue){
//           const subSubValue = subValue[categoryKey];
//           for(const listingKey in subSubValue) {
//             const listing = subSubValue[listingKey]
//             const userRef = database.ref('users');
//             userRef.child(uid).on('value',(snapshot) => {
//               const username = snapshot.val().username;
//               listing["username"] = username;
//               listing["category"] = categoryKey
//             })
//               if((listing["Location Preffered"]===upper || listing["CityName"]===upper) && !containerObject["listingKeys"].includes(listingKey) ){
//                 containerObject["listings"].push(listing);
//             }
//           }
//         }
//       }
//       resolve(containerObject)
//     })
//   })}

// const reservePost = (containerObject) => {
//   return new Promise((resolve, reject)=>{database.ref("ReservePost/").on('value',  (snapshot) => {
//     const value = snapshot.val();
//     for(const uid in value) {
//       const subValue = value[uid];
//       for(const subKey in subValue){
//           const listing = subValue[subKey];
//           const userRef = database.ref('users');
//           userRef.child(uid).on('value',(snapshot) => {
//             const username = snapshot.val().username;
//             listing["username"] = username;
            
//           })
//           if((listing["Location Preffered"]===upper || listing["CityName"]===upper) && !containerObject["listingKeys"].includes(subKey)){
//             containerObject["listings"].push(listing);
//           }
//       }
//     }
//     this.setState({results: containerObject["listings"]})
//     resolve()
//   })
// })
// }