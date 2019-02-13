import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import './Listings.css'
import Carousel from './Carousel';
import * as firebase from 'firebase';

const CondDetails = (props) => {
  const details = props.details;
  if(details['category']===0){
    return(
      <React.Fragment>
        <li>Age: {details["AgeInfo"]}</li>
        <li>Cleaning: {details["CleaningDetails"]}</li>
        <li>Can put deposit: {details["DepositeDetails"]}</li>
        <li>Durasion Seeking: {details["DurationDetails"]}</li>
        <li>Party Habits(Indoor/Outdoor): {details["PartyDetails"]}</li>
        <li>Pets: {details["PetDetails"]}</li>
        <li>Sleeping Time: {details["SleepingDetails"]}</li>
        <li>Smoker: {details["SmokeDetails"]}</li>
      </React.Fragment>
    )
  } else {
      return(
        <React.Fragment>
          <li>Bathrooms: {details["Bathroom"]}</li>
          <li>Bedrooms: {details["Bedroom"]}</li>
          <li>Deposite: {details["deposit"]}</li>
          <li>Availability Starts: {details["StartDate"]}</li>
          <li>Address: {details["Location Preffered"]}</li>
        </React.Fragment>
      )
  }
}

const CondEditButton = (props) => {
  const queryUid = props.history.location.search.split('=')[1];
  const currentUid = firebase.auth().currentUser.uid;
  const listingId = props.details.listingId;
  const routeToEditPage = () => {
    props.history.push({
      pathname: 'listings/edit',
      search: '?id=' + listingId
    });
  }

  if(queryUid===currentUid){
    return <button className="btn btn-primary" onClick={()=>routeToEditPage()}>Edit</button>
  } else {
    return null
  }
}

class DetailsModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false
    }
    this.modalBackgroundClicked = this.modalBackgroundClicked.bind(this);
    this.onCloseButton = this.onCloseButton.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  openModal = () => {
    this.setState({ open: true })
  }

  modalBackgroundClicked = () => {
    this.setState({ open: false })
  }

  onCloseButton = () => {
    this.setState({ open: false })
  }

  handleUserInfo = (uid) => {
    this.props.history.push({
      pathname: '/user',
      search: '?id=' + uid,
    });
  }

  render(){
    const details = this.props.details;
    console.log(details)
    return(
      <div>
        <button type='button' className="btn btn-success" onClick={this.openModal}>Details</button>
 
        <Modal visible={this.state.open} onClickBackdrop={this.modalBackgroundClicked}>
        <div className="modal-header">
          <h5 className="modal-title">{ details["Title"] }</h5>
        </div>
        <div className="modal-body">


          <div style={{backgroundImage: 'url(' + details['imageUrl'] + ')',
          backgroundSize:'cover',
          backgroundPosition:'center',
          backgroundRepeat:'no-repeat',
          height:'300px'}}>
          </div>
          Postedy by <a id='user-name' onClick={()=>this.handleUserInfo(details.passengerKey)}>{ details["username"] }</a>

          <ul>
            <li>{ details["Post Description"] }</li>
          </ul>
        </div>
        <Carousel images = {details["Screenshots"]} />
        <ul>
          <li>Rent: ${ details["Rent"] }</li>
          <CondDetails details={details} />
        </ul>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.onCloseButton}>
            Close
          </button>
          <CondEditButton details={details} {...this.props}/>
        </div>
      </Modal>
      </div>
    );
  }
}

export default DetailsModal;