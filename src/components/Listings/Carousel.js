import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';

class Carousels extends Component {
  constructor(props){
    super(props);
    this.state ={}
  }

  render(){
    const images = this.props.images;
    return(
      <Carousel style={{width:'90'}}>
      {
        Object.keys(images).map((key) => (
        <Carousel.Item key={key}>

          <div 
          className="d-block w-100"
          style={{backgroundImage: 'url(' + images[key] + ')',
          backgroundSize:'cover',
          backgroundPosition:'center',
          backgroundRepeat:'no-repeat',
          height:'300px'}}>
          </div>
        </Carousel.Item>
      ))
    }
    </Carousel>
    )
  }
}

export default Carousels;