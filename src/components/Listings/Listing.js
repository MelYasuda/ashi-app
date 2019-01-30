import React from 'react';

class Listing extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }


  render(){
    var value = this.props.value;
    console.log(this.props.value)
    return(

      <ul>
      { 
        Object.keys(value).map((data, index) => (
        <li>{value[data]}</li>
        )
      )     
      }
      </ul>
    );
  }
}

export default Listing;