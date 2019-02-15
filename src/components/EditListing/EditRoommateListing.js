import React, { Component } from 'react';
import * as firebase from 'firebase';
import TextForm from "../TextForm/TextForm"
import { Formik } from 'formik';
import * as Yup from 'yup';

let selectedFile;

class EditRoommateListing extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      listingValue: null,
      listingId: null,
      category: null,
      currentUid: null
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
    let category = 'Roommate';
    // const categoryId = parseInt(queryObject.category);
    // if (categoryId===0){
    //   category = 'Roommate';
    // } else if (categoryId===1){
    //   category = 'Solo Apartments';
    // } else {
    //   category = 'Shared Apartments';
    // }
    
    this.setState({
      currentUid: uid,
      category:category
    });

    const getListingDetails = () => {
      return new Promise((resolve, reject) => {
        database.ref(`Posts/${country}/${city}/${uid}/${category}/${listingId}/`).on('value',  (snapshot) =>{
          const listingValue = snapshot.val();
          this.setState({
            listingValue: listingValue,
            listingId: listingId
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
  }

  handleEditListing = (values) => {
    let updatedProfileImageUrl = '';
    const difineProfileImageUrl = () => {
      return new Promise((resolve, reject) => {
        if(selectedFile){
          console.log(selectedFile)
          const storageService = firebase.storage();
          const storageRef = storageService.ref();
          const uploadTask = storageRef.child(`Screenshots/${selectedFile.name}`).put(selectedFile); 
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
        const place = values.place;
        const cityCountry = place.split(',');
        const city = cityCountry[0];
        const country = cityCountry[1];
        const currentUid = listingValue.passengerKey;
        const category = this.state.category;
        const {title, introduction, pets, parties, clean, smoke, bedTime, deposit, duration, rent, age} = values;
        firebase.database().ref(`Posts/${country}/${city}/${currentUid}/${category}/${this.state.listingId}`).set({
          "AgeInfo": age,
          "CleaningDetails": clean,
          "DepositeDetails" : deposit,
          "DurationDetails" : duration,
          "Location Preffered" : city,
          "PartyDetails" : parties,
          "PetDetails" : pets,
          "PickUpCoordinate" : [ 42.3602558, -71.0572791 ],
          "Post Description" : introduction,
          "Rent" : rent,
          "Screenshots" : screenShots,
          "SleepingDetails" : bedTime,
          "SmokeDetails" : smoke,
          "Title" : title,
          "creationDate" : '',
          "imageHeight" : 1262,
          "imageUrl" : filePaths[0],
          "imageWidth" : 1125,
          "passengerKey" : currentUid
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
    const {AgeInfo, CleaningDetails, DurationDetails, DepositeDetails, Rent, PartyDetails, Title, PetDetails, SleepingDetails, SmokeDetails, } = listingValue;
    const preferredCity = listingValue['Location Preffered'];
    const desc = listingValue['Post Description'];
    const thumbnail = listingValue['imageUrl'];

    return(
      <div className='container'>
        <h1>EditRoommateListing</h1>
        <Formik 
              initialValues={{ place: preferredCity, title: Title, introduction: desc, pets: PetDetails, parties: PartyDetails, clean: CleaningDetails, smoke: SmokeDetails, bedTime: SleepingDetails, deposit: DepositeDetails, duration: DurationDetails, rent: Rent, age: AgeInfo }}
              onSubmit={this.handleEditListing}
              validationSchema={Yup.object().shape({
                title: Yup.string().required('Title is required'),
                place: Yup.string().required('Place needs to be provided')
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
                    Choose 5 photos to upload for your listing. (The first photo will be the cover photo of your post.)
                      <label htmlFor="file-input">
                          <img id='clickable-img' src={thumbnail} alt="file upload icon"/>
                      </label>
                      <input type='file' id="file-input" onChange={this.handleFileUploadChange} name='pic' className='' />
                    </div>
                    <TextForm
                      title='Please enter your address or place where you are looking for a roommate:'
                      label='Address or place'
                      value={values.place}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='place'
                      error={touched.place && errors.place}
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
                      title='Please tell me something about yourself'
                      value={values.introduction}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='introduction'
                      error={touched.introduction && errors.introduction}
                      />
                    <label htmlFor="pets">Do you have any pets? Are you considering gettin any?:</label>
                    <select
                      className="form-control" 
                      id="pets"
                      value={values.pets}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='pets'
                      >
                      <option value=''>--</option>
                      <option value='Yes'>Yes</option>
                      <option value='Maybe'>Maybe</option>
                      <option value='No'>No</option>
                    </select>
                    <label htmlFor="parties">Do you like to have friends over or keep the party outside?:</label>
                    <select
                      className="form-control" 
                      id="parties"
                      value={values.parties}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='parties'
                      >
                      <option value=''>--</option>
                      <option value='Invite Friends'>Invite Friends</option>
                      <option value='Party Outside'>Party Outside</option>
                      <option value='Both'>Both</option>
                    </select>
                    <label htmlFor="clean">How often do you clean?:</label>
                    <select
                      className="form-control" 
                      id="clean"
                      value={values.clean}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='clean'
                      >
                      <option value=''>--</option>
                      <option value='Alot'>A lot</option>
                      <option value='Party Outside'>Party Outside</option>
                      <option value='Both'>Both</option>
                    </select>
                    <label htmlFor="smoke">Do you smoke?:</label>
                    <select
                      className="form-control" 
                      id="smoke"
                      value={values.smoke}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='smoke'
                      >
                      <option value=''>--</option>
                      <option value='Yes'>Yes</option>
                      <option value='Outside'>Outside</option>
                      <option value='No'>No</option>
                    </select>
                    <label htmlFor="bedTime">What time do you usually go to bed?:</label>
                    <select
                      className="form-control" 
                      id="bedTime"
                      value={values.bedTime}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='bedTime'
                      >
                      <option value=''>--</option>
                      <option value='Before 10'>Before 10</option>
                      <option value='Before 12'>Before 12</option>
                      <option value='Flexible'>Flexible</option>
                    </select>
                    <label htmlFor="deposit">Can you put down a deposit?:</label>
                    <select
                      className="form-control" 
                      id="deposit"
                      value={values.deposit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='deposit'
                      >
                      <option value=''>--</option>
                      <option value='Yes'>Yes</option>
                      <option value='No'>No</option>
                    </select>
                    <label htmlFor="duration">How long do you plan to stay?:</label>
                    <select
                      className="form-control" 
                      id="duration"
                      value={values.duration}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='duration'
                      >
                      <option value=''>--</option>
                      <option value='<6 months'>&#60;6 months</option>
                      <option value='12 months'>&#60;12 months</option>
                    </select>
                    <TextForm
                      title='Rent Enter expected rent($)'
                      label='Rent'
                      value={values.rent}
                      type='number'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='rent'
                      error={touched.rent && errors.rent}
                      />
                    <TextForm
                      title='Age Enter your age'
                      label='Your age'
                      value={values.age}
                      type='number'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name='age'
                      error={touched.age && errors.age}
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

export default EditRoommateListing;