import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './css/Table.css';

const defaultState = {
    name: '',
    email: '',
    phone: '',
    nameError: null,
    phoneError: null,
    emailError: null,
}

const AddNew = observer(class AddNew extends Component {
  state = defaultState;

  // Handlers for inputs
  changeName = (event) => {
    this.setState({
      name: event.target.value,
      nameError: null,
    });
  }

  changeEmail = (event) => {
    this.setState({
      email: event.target.value,
      emailError: null,
    });
  }

  changePhone = (event) => {
    // Regex check only allows integers as input with max length of 15
    if (event.target.value.match(/^[0-9]{0,15}$/)) {
      this.setState({
        phone: event.target.value,
        phoneError: null,
      });
    }
  }

  /* Form validation */

  // Sets error messages
  checkIfValid = () => {
    const { name, email, phone } = this.state;
    let errors = this.state;

    if (name.trim().length < 2) {
      errors.nameError = 'Please enter full name';
    }
    else if (name.match(/\d+/)) {
      errors.nameError = "Name can't contain digits";
    }

    if (!email.match(/\S+@\S+\.\S+/) || email.match(/\s/)) {
      errors.emailError = 'Please enter a valid e-mail address';
    }

    if (phone.length < 5) {
      errors.phoneError = 'Please enter valid phonenumber';
    }

    this.setState(errors);
    
    return (this.checkErrors());
  }

  // Returns false if any error messages are active for disabling submit
  checkErrors = () => {
    const { nameError, phoneError, emailError } = this.state;
        
    return (!nameError && !phoneError && !emailError);
  }

  // Formats name
  formatName = (name) => {
    const titleCase = name.replace(/\b\w/g, c => c.toUpperCase());
    return titleCase.trim().replace(/\s+/g, " ");  // Remove excess whitespace
  }

  // Handles submit
  addParticipant = () => {
    if (this.checkIfValid()) {
      const {name, email, phone} = this.state;

      this.props.store.addParticipant({
        name: this.formatName(name),
        email: email,
        phone: phone,
      });
      // Reset state
      this.setState(defaultState);
    }
  }

  render() {
    const { name, email, phone, nameError, phoneError, emailError } = this.state;

    return(
      <div className="addNew" >
        <div className="form">
          <form className="formInputs" ref="addNew" >

            <input
              className="name" type="text" name="Full name" placeholder='Full name'
              value={name} onChange={this.changeName}
            />

            <input
              className="email" type="email" name="E-mail address" placeholder='E-mail address'
              value={email} onChange={this.changeEmail}
            />

            <input
              className="phone" type="tel" name="Phone number" placeholder='Phone number'
              value={phone} onChange={this.changePhone}
            />

            {/* Add new -button is disabled if any field is missing input or an error message is active */}
            {(name.trim().length > 1 && email.length > 2 && phone.length > 4 && this.checkErrors())
            ?
            <div className="addButton" onClick={this.addParticipant.bind(this)}>
              Add new
            </div>
            :
            <div id="disabled" className="addButton" >
              Add new
            </div>}

          </form>

          {/* Error messages */}
          {!this.checkErrors() && <div className="errors">
            {nameError && <div className="name">{nameError}</div>}
            {emailError && <div className="email">{emailError}</div>}
            {phoneError && <div className="phone">{phoneError}</div>}
          </div>}
        </div>
      </div>
    )
  }
});

export default AddNew;