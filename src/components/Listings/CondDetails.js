import React from 'react';

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

export default CondDetails;