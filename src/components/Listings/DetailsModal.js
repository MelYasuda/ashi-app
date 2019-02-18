import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import './Listings.css'
import Carousel from './Carousel';
import CondDetails from './CondDetails'
import CondModalButtons from './CondModalButtons'


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
          <CondModalButtons details={details} {...this.props}/>
        </div>
      </Modal>
      </div>
    );
  }
}

export default DetailsModal;