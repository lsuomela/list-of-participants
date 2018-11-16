import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './css/App.css';
import './css/Table.css';

import AddNew from './AddNew.jsx';
import Participant from './Participant.jsx';
import store from './ObservableParticipantStore.jsx';

/* Class for column labels */

class ColumnLabel extends Component {
  render() {

    const {columnName, column} = this.props;

    // Get data and direction by which the table is sorted
    const {key, dir} = store.sortBy;

    // Set direction for arrow
    const arrow = dir==='asc'?'arrow_upward':'arrow_downward';

    if (column === key && store.participant.length > 0) {
      return <strong>{columnName} <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet" /><i className="material-icons" style={{fontSize:14,padding:0}} >{arrow}</i></strong>;
    }
    else return columnName;
  }
}

/* Class for rendering table */

const Table = observer(class Table extends Component {

  // Load participants when component mounts
  componentDidMount() {
    store.loadParticipants();    
  }

  // Function for sorting participants
  sorter = (a, b) => {
    const {key, dir} = store.sortBy;
    const x = (dir==='asc'?-1:1);
    if (a[key] < b[key]) {
      return x;
    }
    if (a[key] > b[key]){
      return -x;
    }
    return 0;
  }

  render() {
    
    // Gets participants from store and sorts them
    const sortedParticipants = store.participant.sort(this.sorter);

    return (
      <div>
        
        <AddNew store={store} />
        <div>
          <div className="tableLabels" >

            <div id="nameLabel" className='name' onClick={() => {store.setSorting('name')}}>
              <ColumnLabel column='name' columnName='Name' />
            </div>

            <div id="emailLabel" className='email' onClick={() => {store.setSorting('email')}}>
              <ColumnLabel column='email' columnName='E-mail address' />
            </div>

            <div id="phoneLabel" className='phone' onClick={() => {store.setSorting('phone')}}>
              <ColumnLabel column='phone' columnName='Phone number' />
            </div>

          </div>
          
          {/* Maps sorted list of participants into rows */}
          {sortedParticipants.map(info =>
            <Participant store={store} info={info} key={info.id} />
          )}
          
        </div>
      </div>
    );
  }
});

export default Table;