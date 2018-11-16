import React, { Component } from 'react';
import './css/Table.css';
import { observer } from 'mobx-react';

const Participant = observer( class Participant extends Component {

  constructor(props) {
    super(props);

    // Storing values for editing
    this.state = {
      editorOpen: false,
      editedName: this.props.info.name,
      editedEmail: this.props.info.email,
      editedPhone: this.props.info.phone
    }
    this.store = this.props.store;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.info !== nextProps.info) {
      this.updateState(nextProps);
    }
  }

  // Function for setting default state from props
  updateState = (props) => {
    this.setState({
      editorOpen: false,
      editedName: props.info.name,
      editedEmail: props.info.email,
      editedPhone: props.info.phone,
    });
  }

  /* Event handlers */

  changeName = (event) => {
    this.setState({editedName: event.target.value});
  }

  changeEmail = (event) => {
    this.setState({editedEmail: event.target.value});
  }

  changePhone = (event) => {
    // Regex check only allows integers as input with max length of 15
    if (event.target.value.match(/^[0-9]{0,15}$/)) {
      this.setState({ editedPhone: event.target.value });
    }
  }

  toggleEditor = () => {
    this.state.editorOpen ? this.updateState(this.props) : this.setState({editorOpen: true});
  }

  // Formats name
  formatName = (name) => {
    const titleCase = name.replace(/\b\w/g, c => c.toUpperCase());
    return titleCase.trim().replace(/\s+/g, " ");  // Remove excess whitespace
  }

  /* Functions for editing ParticipantStore */

  editParticipant = () => {
    const formattedName = this.formatName(this.state.editedName);

    this.store.editParticipant({
      name: formattedName,
      email: this.state.editedEmail,
      phone: this.state.editedPhone,
      id: this.props.info.id
    });
    this.toggleEditor();
  }

  removeParticipant = () => {
    this.store.removeParticipant(this.props.info.id);
  }

  /* Validates inputs
   * Email regex: string@string.string, no whitespace
   * Phone regex: 4-15 integers
   */
  validate = () => {
    const { editedName, editedEmail, editedPhone } = this.state;
    return editedName.trim().length > 1 && editedEmail.match(/^\S+@\S+\.\S+$/) && !editedEmail.match(/\s/) && editedPhone.match(/^[0-9]{4,15}$/);
  }

  render() {
    const { editedName, editedEmail, editedPhone } = this.state;
    const { info } = this.props;
  
    return (
      <div>
        {/* Get edit and remove icons */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet" />
      
        {/* If !editorOpen, display participant data, else render inputs for editing */}
        {!this.state.editorOpen
          ?  
          <div className="row" >

            <div className="name" >
              {info.name}
            </div>

            <div className="email" >
              {info.email}
            </div>

            <div className="phone" >
              {info.phone}
            </div>

            <div id="iconButton">
              <div onClick={this.toggleEditor.bind(this)}>
                <i className="material-icons">edit</i>
              </div>

              <div onClick={this.removeParticipant.bind(this)}>
                <i className="material-icons">delete</i>
              </div>
            </div>

          </div>
          :
          // Editing participant data
          <div className="form">
            <form className="formInputs" >

              <input
                className="name" type="text" name="Edit name"
                value={editedName} onChange={this.changeName.bind(this)}
              />

              <input
                className="email" type="email" name="Edit email"
                value={editedEmail} onChange={this.changeEmail.bind(this)}
              />

              <input
                className="phone" type="text" name="Edit phone"
                value={editedPhone} onChange={this.changePhone.bind(this)}
              />
           
              <div className="buttons">
                <div className="cancel" onClick={this.toggleEditor.bind(this)} >
                  Cancel
                </div>

                {/* Save button is disabled if any input isn't valid */}
                {(this.validate())
                ?
                <div className="save" onClick={this.editParticipant.bind(this)}>
                  Save
                </div>
                :
                <div id="disabled" className="save" >
                  Save
                </div>}

              </div>
            </form>
          </div>
        }
      </div>
    )
  }
});

export default Participant;
