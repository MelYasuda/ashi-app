import React from 'react';
import './Listings.css'

class Listing extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }


  render(){
    var value = this.props.value;
    var imgUrl = value["imageUrl"];
    return(
      <div className='card-deck' style={{ marginTop: 15 }}>
        <div className="card" style={{ width: 18 + "em", marginRight: 40 }}>
          <div style={{backgroundImage: 'url(' + imgUrl + ')',
          backgroundSize:'cover',
          backgroundPosition:'center',
          backgroundRepeat:'no-repeat',
          height:'200px'}}>
          </div>
          <div className="card-body">
            <h5 className="card-title">{value["Title"]}</h5>
            <p className="card-text">
            ${value["Rent"]} <br />
            {value["username"]}
            </p>
            <button className="btn btn-primary">
              Details
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// { 
//   Object.keys(value).map((data, index) => (
//   <li>{value[data]}</li>
//   )
// )     
// }

// const imgStyle = {
//   backgroundImage: 'url(' + imgUrl + ')',
// }


export default Listing;