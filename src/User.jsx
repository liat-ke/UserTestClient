//Import External Files
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box } from "@material-ui/core";

//Import Internal Files
import TextInput from "./TextInput"
import './User.css';


const User = () => {
  const [birthDate, setBirthDate] = useState();
  const [message, setMessage] = useState("");
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    userName: ""
  })
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [userNameMessage, setUserNameMessage] = useState("");
  const [showGeneralMessage, setShowGeneralMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  let Id = 1;
  const baseUrl = "https://localhost:44337/user"

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    setShowGeneralMessage(false);
    setShowSuccessMessage(false);
    try {
      const res = await fetch(baseUrl + "/" + Id, { mode: 'cors' });
      const resJson = await res.json();
      if (res.status === 200) {
        handleReturnData(resJson);
      } else {
        setMessage(`Some error occured. Error: ${res.error}`);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrorMessage(false);
    try {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
          ID: Id,
          UserName: state.userName,
          FirstName: state.firstName,
          LastName: state.lastName,
          BirthDate: birthDate,
        })
      };

      const res = await fetch(baseUrl + "/" + Id, requestOptions);
      if (res.status !== 200) {
        setShowGeneralMessage(true);
        setMessage("Some error occured. Please Contact Us");
        return;
      }

      const resJson = await res.json();
      if (res.status === 200) {
        handleReturnData(resJson);
        setShowSuccessMessage(true);
      } else {
        setShowGeneralMessage(true);
        setShowSuccessMessage(false);
        setMessage(`Some error occured. Error: ${res.error}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearMessage = () => {
    setShowGeneralMessage(false);
    setShowErrorMessage(false);
    setShowSuccessMessage(false);
    setUserNameMessage("");
  }

  const handleReturnData = (resJson) => {
    setState({
      ...state,
      firstName: resJson.firstName,
      lastName: resJson.lastName,
      userName: resJson.userName
    });
    setBirthDate(new Date(resJson.birthDate));
  }

  const checkUserName = (userNameVal) => {
    if (userNameVal) {
      if (state.firstName) {
        if(userNameVal.toLowerCase().includes(state.firstName.toLowerCase()))
        {
          handleError();
          return;
        }
      }
      if (state.lastName) {
        if((userNameVal.toLowerCase().includes(state.lastName.toLowerCase()))){
          handleError();
          return;
        }
       
      }
    }
    setState({
      ...state,
      userName: userNameVal
    });
    setShowErrorMessage(false);
    setUserNameMessage("");
  }


  const handleError = (userNameVal, fieldText) => {
      setShowErrorMessage(true);
      setUserNameMessage("User Name Can Not Includes Your First Name Or Last Name");

  }

  const handleChange = (evt) => {
    clearMessage();
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  }

  const handleBlur = (e) => {
    checkUserName(e.target.value);
  }

  return (
    <Box className="div-form">
      <h3>User Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-div">

          <div className="first-name container-div">
            <label for="firstName" className="lbl-form">First Name: </label>
            <TextInput
              value={state.firstName}
              placeHolder="Enter your first name"
              name="firstName"
              id="firstName"
              onChangeProp={handleChange}>
            </TextInput>
          </div>

          <div className="last-name container-div">
            <label for="lastName" className="lbl-form">Last Name: </label>
            <TextInput
              value={state.lastName}
              placeHolder="Enter your last name"
              name="lastName"
              id="lastName"
              onChangeProp={handleChange}>
            </TextInput>
          </div>

          {
            showErrorMessage === true &&
            <span className="spn-error-msg">{userNameMessage}</span>
          }

          <div className="user-name container-div">
            <label for="userName" className="lbl-form">User Name: </label>
            <TextInput
              value={state.userName}
              placeHolder="Enter your user name"
              name="userName"
              onBlurProp={handleBlur}
              onChangeProp={handleChange}>
            </TextInput>
          </div>

          <div className="birth-date container-div">
            <label for="birthDay" className="lbl-form">BirthDay: </label>
            <DatePicker placeholderText="Enter your birthday"
              id="birthDay"
              selected={birthDate} onChange={(date) => setBirthDate(date)} />
          </div>
        </div>

        <button type="submit" className="btn-submit">Update User</button>
        {
          showGeneralMessage === true &&
          <div className="err-message">{message ? <p>{message}</p> : null}</div>
        }

        {
          showSuccessMessage === true &&
          <div className="success-message">{message ? <p>הפעולה בוצעה בהצלחה</p> : null}</div>
        }


      </form>
    </Box>
  );
};



export default User;