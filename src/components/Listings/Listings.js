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

    const americaListings = () => {
      return new Promise((resolve,reject)=>{
        database.ref("Posts/United States/" + upper + "/").on('value', (snapshot) => {
          let value = snapshot.val();
          resolve(value)
        })
      })
    }

    const canadaListings = (canadaValue) => {
      console.log(canadaValue)
      return new Promise((resolve,reject)=>{
        if (canadaValue===null){
          database.ref("Posts/Canada/" + upper + "/").on('value',  (snapshot) =>{
            canadaValue = snapshot.val();
            resolve(canadaValue)
          })
        } else{
          resolve(canadaValue)
        }
      })
    }

    const posts = (value) => {
      return new Promise((resolve, reject)=>{
        console.log(value)
      const listings = [];
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
            if(categoryKey==="Roommate"){
              listing["category"] = 0
              } else if (categoryKey==="Solo Apartments"){
              listing["category"] = 1
              } else {
              listing["category"] = 2
              }
            listing["listingKey"] = listingKey;
            listings.push(listing);
          }
        }
      }
      resolve(listings)

  })}


  const categoryKey = (listings) => {
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

  americaListings().then(canadaListings).then(posts).then(categoryKey).then(setLoadingState);

  //end of constructor
  }

  render(){
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
                <Listing key={index} value={value} history={this.props.history}/>
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