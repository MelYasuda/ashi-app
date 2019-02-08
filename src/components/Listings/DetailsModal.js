import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import Carousel from './Carousel';

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
        </React.Fragment>
      )
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
      state: { detail: uid }
    });
  }

  render(){
    const details = this.props.details;
    console.log(details);
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

          <ul>
            <li>{ details["Post Description"] }</li>
            <li>{ details["Rent"] }</li>

            <li onClick={()=>this.handleUserInfo(details.passengerKey)}>{ details["username"] }</li>

            <CondDetails details={details} />
          </ul>
        </div>
        <Carousel images = {details["Screenshots"]} />
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={this.onCloseButton}>
            Fire phasers
          </button>
        </div>
      </Modal>
      </div>
    );
  }
}

export default DetailsModal;