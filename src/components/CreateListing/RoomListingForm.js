import React, { Component } from 'react';
import TextForm from "../TextForm/TextForm"
import { Formik } from 'formik';
import * as Yup from 'yup';
import photoUpload from '../../assets/img/upload.png'
import * as firebase from 'firebase';

let selectedFile =[];

class RoomListingForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUid: null,
      selectedCategory: null
    }
  }

  componentDidMount(){
    const currentUid = firebase.auth().currentUser.uid;
    const categoryProp = this.props.category;
    let categoryPicked = null;
    if (categoryProp === 'room') {
      categoryPicked = 'Shared Apartments';
    } else {
      categoryPicked = 'Solo Apartments';
    }
    this.setState({
      currentUid: currentUid,
      selectedCategory: categoryPicked
    })
  }

  handleGoBack = () => {
    this.props.history.push("/")
  }

  backToCreateSelection = (value) => {
    this.props.onCategoryForm(value)
  }
  

  handleCreateListing = (values) => {
    console.log(values);
    const promises = [];
    const handlePhotosSubmit = () => {
      for(let i=0; i<selectedFile.length; i++){
      promises.push(new Promise((resolve, reject) => {
          const storageService = firebase.storage();
          const storageRef = storageService.ref();
          const uploadTask = storageRef.child(`Screenshots/${selectedFile[i].name}`).put(selectedFile[i]); 
          uploadTask.then(snapshot => {
            return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {
          const filePath = downloadURL;
          resolve(filePath);
          })
      })
      )
    }
    return Promise.all(promises)
    }

    const handleWriteListing = (filePaths) => {
      return new Promise((resolve, reject)=> {
        const address = values.address;
        const cityCountry = address.split(',');
        const city = cityCountry[0];
        const country = cityCountry[1];
        const currentUid = this.state.currentUid;
        const category = this.state.selectedCategory;
        const {title, desc, bedrooms, bathrooms, preferredCity, deposit, startDate, budget} = values;
        firebase.database().ref(`Posts/${country}/${city}/${currentUid}/${category}`).push().set({
          "Bathroom": bathrooms,
          "Bedroom": bedrooms,
          "CityName": city,
          "Location Preffered": preferredCity,
          "PickUpCoordinate" : [ 42.3602558, -71.0572791 ],
          "Post Description": desc,
          "Rent" : budget,
          "Screenshots" : filePaths,
          "Title" : title,
          "creationDate" : 1.533240483371027E9,
          "deposit": deposit,
          "imageHeight" : 1262,
          "imageUrl" : filePaths[0],
          "imageWidth" : 1125,
          "passengerKey" : currentUid,
          "StartDate": startDate
        })
      resolve()
      })
    }


    const handleRouteToListing = () => {
      this.props.history.push({
        pathname: '/user',
        search: '?id=' + this.state.currentUid
      })
    }

    handlePhotosSubmit().then(handleWriteListing).then(handleRouteToListing)
  }

  handleFileUploadChange = (e) => {
    const filePath = e.target.files[0];
    if(filePath){
      selectedFile.push(e.target.files[0]);
    }
  }


  render(){
    return(
      <div>
        <div className="Room">
          <h1>Creat A {this.state.selectedCategory} Listing</h1>
            <Formik 
              initialValues={{ address: '', title: '', desc: '', bedrooms: '', bathrooms: '', budget: '', deposit: '', startDate: '', preferredCity: '' }}
              onSubmit={this.handleCreateListing}
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
                touched
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="image-upload">
                    Choose 5 photos to upload for your listing. (The first photo will be the cover photo of your post.)
                      <label htmlFor="file-input">
                          <img id='clickable-img' src={photoUpload} alt="file upload icon"/>
                      </label>
                      <input type='file' id="file-input" onChange={this.handleFileUploadChange} name='pic' className='' />
                    </div>
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
                        value={values.startDate}
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


        <div className='buttons'>
          <button className='btn btn-primary' onClick={this.handleGoBack}>Back</button>
            <button className='btn btn-secondary' onClick={()=>this.backToCreateSelection(null)}>Categories</button>
        </div>

      </div>
    );
  }
}

export default RoomListingForm;


