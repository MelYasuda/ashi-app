import React, { Component } from 'react';
import TextForm from "../TextForm/TextForm"
import { Formik } from 'formik';
import * as Yup from 'yup';
import photoUpload from '../../assets/img/upload.svg'
import * as firebase from 'firebase';
import './CreateListing.css';

const uuidv4 = require('uuid/v4');

let selectedFile =[];

const FilesPreview = (props) => {
  const files = props.files;
  console.log(files)
  return(
    files.map( file =>
      <img id='multi-img' src={URL.createObjectURL(file)}/>
  )
  )
} 


const CondFilePreview = (props) => {
  const files = props.files;
  if(files){
    return (<FilesPreview files={files}/>)
  }
   return null
}

class ApartmentListingForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUid: null,
      selectedCategory: null,
      files: null
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
          const uploadTask = storageRef.child(`Screenshots/${uuidv4()}`).put(selectedFile[i]); 
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
        const screenShots = filePaths.slice(1);
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
          "Screenshots" : screenShots,
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

    if(selectedFile.length>=2){
    handlePhotosSubmit().then(handleWriteListing).then(handleRouteToListing)
    } else {
      alert('Please select at least 2 images');
    }
  }

  handleFileUploadChange = (e) => {
    const filePath = e.target.files[0];
    if(filePath){
      selectedFile.push(e.target.files[0]);
      this.setState({
        files: selectedFile
      })
    }
  }


  render(){
    return(
      <div>
          <h2 className='create-page-header'>Create A {this.state.selectedCategory} Listing</h2>
          <button className='btn btn-secondary back-categories-btn' onClick={()=>this.backToCreateSelection(null)}>Select Other Categories</button>
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
                  <div className='row create'>
                    <div className="image-upload">
                      <ul className='upload-img-txt'>
                      <em>Choose 5 photos to upload for your listing (required)</em>
                        <li>Click the photo icon on the right to choose photos</li>
                        <li>The first photo will be the cover photo of your post</li>
                      </ul>
                      <label htmlFor="file-input">
                          <img className='clickable-img' src={photoUpload} alt="file upload icon"/>
                      </label>
                      <input type='file' id="file-input" onChange={this.handleFileUploadChange} name='pic' className='' />
                      <CondFilePreview files={this.state.files} />
                    </div>
                      <div className='col-md-6'>
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
                      </div>

                      <div className='col-md-6'>
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
                      </div>
                    </div>
                      <button
                        type="submit"
                        className="btn btn-success create-submit"
                        >
                        Submit
                      </button>
                  </form>
                )}
              />
      </div>
    );
  }
}

export default ApartmentListingForm;


