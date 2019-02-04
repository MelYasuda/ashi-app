import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal'

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

  render(){
    const details = this.props.details;
    const image = details["Screenshots"]; 

    return(
      <div>
        <button type='button' className="btn btn-success" onClick={this.openModal}>Details</button>
 
        <Modal visible={this.state.open} onClickBackdrop={this.modalBackgroundClicked}>
        <div className="modal-header">
          <h5 className="modal-title">{ details["Title"] }</h5>
        </div>
        <div className="modal-body">
          <ul>
              <li>{ details["Post Description"] }</li>
              <li>{ details["Rent"] }</li>
              { details["AgeInfo"] ? <li>{details["AgeInfo"]}</li>: null }
              <li>{ details["username"] }</li>

              {/* roommate */}
              { details["CleaningDetails"] ? <li>{details["CleaningDetails"]}</li>: null }
              { details["DepositeDetails"] ? <li>{details["DepositeDetails"]}</li>: null }
              { details["DurationDetails"] ? <li>{details["DurationDetails"]}</li>: null }
              { details["PartyDetails"] ? <li>{details["PartyDetails"]}</li>: null }
              { details["PetDetails"] ? <li>{details["PetDetails"]}</li>: null }
              { details["SleepingDetails"] ? <li>{details["SleepingDetails"]}</li>: null }
              { details["SmokeDetails"] ? <li>{details["SmokeDetails"]}</li>: null }


              {
                Object.keys(image).map((key) => 
                <img src={image[key]} style={{height:"270px" }} />
              )
            }

            =======================
          </ul>
        </div>
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