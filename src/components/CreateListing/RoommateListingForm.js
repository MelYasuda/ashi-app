import React, { Component } from 'react';
import TextForm from "../TextForm/TextForm"
import { Formik } from 'formik';
import * as Yup from 'yup';
import photoUpload from '../../assets/img/upload.svg'
import * as firebase from 'firebase';

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

class RoommateListingForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUid: null,
      files: null
    }
  }

  componentDidMount(){
    const currentUid = firebase.auth().currentUser.uid;
    this.setState({
      currentUid: currentUid,
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
        const place = values.place;
        const cityCountry = place.split(',');
        const city = cityCountry[0];
        const country = cityCountry[1];
        const currentUid = this.state.currentUid;
        const category = 'Roommate';
        const {title, introduction, pets, parties, clean, smoke, bedTime, deposit, duration, rent, age} = values;
        firebase.database().ref(`Posts/${country}/${city}/${currentUid}/${category}`).push().set({
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
        console.log(city, country)
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
        <div className="container">
          <h1>Create A Roommate Listing</h1>
            <Formik 
              initialValues={{ place: '', title: '', introduction: '', pets: '', parties: '', clean: '', smoke: '', bedTime: '', deposit: '', duration: '', rent: '', age: '' }}
              onSubmit={this.handleCreateListing}
              validationSchema={Yup.object().shape({
                title: Yup.string().required('Title address is required'),
                place: Yup.string().required('Place needs to be provided')
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

                    <CondFilePreview files={this.state.files}/>

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
          <div className='buttons'>
            <button className='btn btn-primary' onClick={this.handleGoBack}>Back</button>
            <button className='btn btn-secondary' onClick={()=>this.backToCreateSelection(null)}>Categories</button>
          </div>
        </div>
      </div>
    );
  }
}

export default RoommateListingForm;