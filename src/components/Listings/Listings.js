import React from 'react';
import * as firebase from 'firebase';
import Listing from './Listing';

class Listings extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      results: null,
      isLoading: true
    }
    // var database = firebase.database();

    new Promise((resolve, reject)=>{firebase.database().ref("Posts/United States/Boston/").on('value',  (snapshot) => {
      const value = snapshot.val();
      var data = []
      for(var key in value) {
        var subValue = value[key];
        for(var subKey in subValue){
          var subSubValue = subValue[subKey];
          for(var subSubKey in subSubValue) {
            data.push(subSubValue[subSubKey]);
          }
        }
      }
      this.setState({results: data})
      resolve()
    })
  }).then(()=> {
    this.setState( {isLoading: false} )
  })
  }


  render(){
    if(this.state.isLoading) return null;
    return(
      <div className='container'>
        <div className='row'>
          <h1>List</h1>
          {this.state.results.map((result, index)=> 
              
              <Listing value={result}/>
            )}
        </div>
      </div>
    );
  }
}



export default Listings;