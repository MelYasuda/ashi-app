import React, { Component } from 'react';
import * as firebase from 'firebase';
import TextForm from "../TextForm/TextForm"
import { Formik } from 'formik';
import * as Yup from 'yup';

const uuidv4 = require('uuid/v4');

let selectedFile;

class EditApartmentListing extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      listingValue: null,
      listingId: null,
      category: null,
      currentUid: null,
      file: null
    }
  }

  componentDidMount(){
    const database = firebase.database();
    const queryObject = {}
    const query = this.props.history.location.search.split('?');
    query.map(part => {
      const pair = part.split('=');
      const key = pair[0];
      const value = decodeURI(pair[1]);
      queryObject[key] = value
    })

    const country = queryObject.country;
    const city = queryObject.city;
    const uid = queryObject.id;
    const listingId = queryObject.listingId;
    let category = null;
    const categoryId = parseInt(queryObject.category);
    if (categoryId===0){
      category = 'Roommate';
    } else if (categoryId===1){
      category = 'Solo Apartments';
    } else {
      category = 'Shared Apartments';
    }
    
    this.setState({
      currentUid: uid,
      category:category
    });

    const getListingDetails = () => {
      return new Promise((resolve, reject) => {
        database.ref(`Posts/${country}/${city}/${uid}/${category}/${listingId}/`).once('value',  (snapshot) =>{
          const listingValue = snapshot.val();
          const file = listingValue['imageUrl']
          this.setState({
            listingValue: listingValue,
            listingId: listingId,
            file: file
          })
          resolve();
        })
      })
    }

    const loadPage = () => {
      this.setState({
        isLoading: false
      })
      console.log('redirect')
    }

    getListingDetails().then(loadPage)
  }

  handleFileUploadChange = (e) => {
    selectedFile = e.target.files[0];
    this.setState({
      file: URL.createObjectURL(selectedFile)
    })
  }

  handleEditListing = (values) => {
    let updatedProfileImageUrl = '';
    const difineProfileImageUrl = () => {
      return new Promise((resolve, reject) => {
        if(selectedFile){
          console.log(selectedFile)
          const storageService = firebase.storage();
          const storageRef = storageService.ref();
          const uploadTask = storageRef.child(`Screenshots/${uuidv4()}`).put(selectedFile); 
          uploadTask.then(snapshot => {
            return snapshot.ref.getDownloadURL(); 
        }).then(downloadURL => { 
          updatedProfileImageUrl = downloadURL;
          resolve()
         })
        } else {
          updatedProfileImageUrl = this.state.listingValue.imageUrl;
          resolve()
        }
      })
    }

    const handleWriteListing = (filePaths) => {
      return new Promise((resolve, reject)=> {
        const listingValue = this.state.listingValue;
        const screenShots = listingValue['Screenshots'];
        const address = values.address;
        const cityCountry = address.split(',');
        const city = cityCountry[0];
        const country = cityCountry[1];
        const currentUid = listingValue.passengerKey;
        const category = this.state.category;
        const {title, desc, bedrooms, bathrooms, preferredCity, deposit, startDate, budget} = values;
        firebase.database().ref(`Posts/${country}/${city}/${currentUid}/${category}/${this.state.listingId}`).set({
          "Bathroom": bathrooms,
          "Bedroom": bedrooms,
          "CityName": city,
          "Location Preffered": preferredCity,
          "PickUpCoordinate" : [ 42.3602558, -71.0572791 ],
          "Post Description": desc,
          "Rent" : budget,
          "Screenshots" : screenShots,
          "Title" : title,
          "creationDate" : 1.533240483371027E9,
          "deposit": deposit,
          "imageHeight" : 1262,
          "imageUrl" : updatedProfileImageUrl,
          "imageWidth" : 1125,
          "passengerKey" : currentUid,
          "StartDate": startDate
        })
      resolve()
      })
    }

    const handleRouteToEditedListing = () => {
      this.props.history.push({
        pathname: '/user',
        search: '?id=' + this.state.currentUid
      })
      console.log('route');
    }

    difineProfileImageUrl().then(handleWriteListing).then(handleRouteToEditedListing)
  }

  render(){
    console.log(this.state.listingValue);
    if(this.state.isLoading) return null;
    const listingValue = this.state.listingValue;
    const {Bathroom, Bedroom, CityName, Rent, StartDate, Title, deposit} = listingValue;
    const preferredCity = listingValue['Location Preffered'];
    const desc = listingValue['Post Description'];
    const thumbnail = this.state.file;

    return(
      <div className='container'>
        <h1>EditApartmentListing</h1>
        <Formik 
              initialValues={{ address: CityName, title: Title, desc: desc, bedrooms: Bedroom, bathrooms: Bathroom, budget: Rent, deposit: deposit, startDate: StartDate, preferredCity: preferredCity }}
              onSubmit={this.handleEditListing}
              validationSchema={Yup.object().shape({
                title: Yup.string().required('Title address is required'),
                address: Yup.string().required('Place needs to be provided')
              })}
              render={({
                values,
                handleSubmit,
                handleChange,
                handleBlur,
                errors,
                touched,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="image-upload">
                    You can choose a different thumbnail photo for your listing.
                      <label htmlFor="thumbnail-input">
                        <img id='clickable-img' src={thumbnail} alt="file upload icon"/>
                      </label>
                      <input type='file' id="thumbnail-input" onChange={this.handleFileUploadChange} name='pic' className='' />
                    </div>


                    {/* <div className="image-upload">
                    Choose 5 photos to upload for your listing. (The first photo will be the cover photo of your post.)
                      <label htmlFor="file-input">
                        <img id='clickable-img' src={photoUpload} alt="file upload icon"/>
                      </label>
                      <input type='file' id="file-input" onChange={this.handleFileUploadChange} name='pic' className='' />
                    </div> */}

                    <TextForm
                      title='Please enter your address of your property:'
                      label='Address'
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='address'
                      error={touched.address && errors.address}
                      />
                    <TextForm
                      title='Title of your post'
                      label='Title'
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='title'
                      error={touched.title && errors.title}
                      />
                    <TextForm
                      title='Description of your property'
                      value={values.desc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='desc'
                      error={touched.desc && errors.desc}
                      />
                    <label htmlFor="bedrooms">How many bedrooms does your property have?:</label>
                    <select
                      className="form-control" 
                      id="bedrooms"
                      value={values.bedrooms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='bedrooms'
                      >
                      <option value=''>--</option>
                      <option value='Studio'>Studio</option>
                      <option value='1'>1</option>
                      <option value='2'>2</option>
                      <option value='3'>3</option>
                      <option value='4'>4</option>
                      <option value='5'>5</option>
                    </select>
                    <label htmlFor="bathrooms">How many bathrooms does your property have?:</label>
                    <select
                      className="form-control" 
                      id="bathrooms"
                      value={values.bathrooms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='bathrooms'
                      >
                      <option value=''>--</option>
                      <option value='1'>1</option>
                      <option value='1.5'>1.5</option>
                      <option value='2'>2</option>
                      <option value='2.5'>2.5</option>
                      <option value='3'>3</option>
                      <option value='3.5'>3.5</option>
                      <option value='4'>4</option>
                      <option value='4.5'>4.5</option>
                      <option value='5'>5</option>
                    </select>
                    <label htmlFor="preferredCity">Select Your City:</label>
                    <select
                      className="form-control" 
                      id="preferredCity"
                      value={values.preferredCity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='preferredCity'
                      >
                      <option value=''>--</option>
                      <option value='Boston'>Boston</option>
                      <option value='New York City'>New York City</option>
                      <option value='Toronto'>Toronto</option>
                    </select>
                    <TextForm
                      title='Budget'
                      label='Enter Budget($)'
                      value={values.budget}
                      type='number'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='budget'
                      error={touched.budget && errors.budget}
                      />
                    <TextForm
                      title='Deposit'
                      label='Enter expected Deposit($)'
                      value={values.deposit}
                      type='number'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='deposit'
                      error={touched.deposit && errors.deposit}
                      />
                      <label htmlFor='start-date'>Availability Starts: </label>
                      <input 
                        type='date'
                        id='start-date'
                        value={values.startDate}
                        name='startDate'
                        error={touched.startDate && errors.startDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                         />
                    <button
                      type="submit"
                      className="btn btn-success"
                      >
                      Submit
                    </button>
                  </form>
                )}
              />
      </div>
    )
    
    
  }
}

export default EditApartmentListing;