import {action, observable, decorate} from 'mobx'

// Set url for fetching random names & emails
const API = "https://randomuser.me/api/?results=20&nat=fi&inc=name,email";

class ObservableParticipantStore {
  participant = [];
  sortBy = {key: 'name', dir: 'asc'};

  // Gets random users from randomuserapi
  loadParticipants = () => {
    fetch(API)
      .then(response => response.json())
      .then(data => this.init(data.results));
  }

  // Initialize the db with random participants
  init = (data) => {
    data.forEach(participant => {
      const {name, email} = participant;

      // Add participant to array
      this.participant.push(
        {
          name: this.formatName(name.first, name.last),
          email: email,
          phone: this.getPhone(),
          id: this.createId()
        }
      );
    });
  }

  // Capitalizes names and returns full name
  formatName = (first, last) => {
    const fullName = `${first} ${last}`;
    return fullName.replace(/\b\w/g, c => c.toUpperCase());
  }

  // Returns fake phone number
  getPhone = () => {
    let phone = '0';
    for (let i = 0; i < 9; i++) {
      phone += Math.floor(Math.random() * 10);
    }
    return phone;
  }

  // Returns an unused random integer id between 0 and 1000
  createId = () => {
    const id = Math.floor(Math.random() * 1000);
    return this.getIndex(id) === -1 ? id : this.createId();
  }

  // Sets sorting rule for participant table
  setSorting = (str) => {
    this.sortBy.key === str
    ?
    (this.sortBy.dir === 'asc' ? this.sortBy.dir = 'desc' : this.sortBy.dir = 'asc')
    :
    this.sortBy = {key: str, dir: 'asc'};
  }

  // Returns index of the participant with id
  // matching the parameter, -1 if no match is found
  getIndex = (id) => {
    return this.participant.findIndex(x => x.id === id);
  }

  /* Functions for manipulating participant-array */

  addParticipant = (user) => {
    user.id = this.createId();
    this.participant.push(user);
  }

  editParticipant = (user) => {
    const index = this.getIndex(user.id);
    this.participant.splice(index, 1, user);
  }

  removeParticipant = (id) => {
    const index = this.getIndex(id);
    this.participant.splice(index, 1)
  }
}

decorate(ObservableParticipantStore, {
  participant: observable,
  sortBy: observable,
  setSorting: action,
  addParticipant: action,
  editParticipant: action,
  removeParticipant: action,
})

const store = new ObservableParticipantStore();
export default store;
