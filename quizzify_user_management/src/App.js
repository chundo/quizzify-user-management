import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableTextField from './Xeditable/EditableTextField';
import EditableSelect from './Xeditable/EditableSelect';
import './App.css';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

class App extends Component {
  static propTypes = {
    name: PropTypes.string,
    first_name:PropTypes.string,
    last_name:PropTypes.string,
    email:PropTypes.string,
    screen_name:PropTypes.string,
    sub_company_id:PropTypes.string,
    newGroupName: PropTypes.string,
    newGroupAbbreviation: PropTypes.string,
    id:PropTypes.string,
  };
  
  constructor(props) {
    super(props);

		this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeGroup = this.handleChangeGroup.bind(this);
    this.handleChangeAbbre = this.handleChangeAbbre.bind(this);

    this.state = {
      isLoading: true ,
      showModal: false,
      quizzifyUsers: [],
      companyGroups: [],
      newGroupName: '',
      newGroupAbbreviation: '',
     };
  }

  componentDidMount(){
    this.fetchUsers();
    this.fetchGroups();
  }

  handleClose() {
		this.setState({ showModal: false });
	}

	handleShow() {
		this.setState({ showModal: true });
  }
  
  handleChangeGroup(event) {
    this.setState({
      newGroupName: event.target.value,
    });
  }

  handleChangeAbbre(event) {
    this.setState({
      newGroupAbbreviation: event.target.value,
    });
  }

  handleSubmit(event){
    
  }

  handleUpdate = (name, value, placeholder) => { /*Name: position in the array (i), Value: the new value to exchange, Placeholder: name of the attribute in the object to change*/
    let quizzifyUsers = this.state.quizzifyUsers;
    quizzifyUsers[name][placeholder] = value; /* name is a number to access the object, placeholder identifies the atribute to modify in the object  */
 
    
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'PUT',
      headers,
      body: JSON.stringify({ "user": quizzifyUsers[name]}) /*quizzifyUsers[name]*/
    }
    const request = new Request(`http://192.168.0.20:3000/api/v2/users/${quizzifyUsers[name].id}?token=5b48a186f6334844b6cb3ccbfe77250c`, options); /*using local network for testing API*/
    console.log(request.url);
    
    console.log(JSON.stringify(quizzifyUsers[name]));
    fetch(request).then(response => {
      console.log(response.status);
    if (response.status === 200) {
      this.setState({quizzifyUsers});
    } else {
      alert(`Something went wrong, Please try again ... ${response.status}`);
      throw new Error('Something went wrong on api server!');
    }
  })
  .then(response => {
    console.debug(response);
    // ...
    }).catch(error => {
    console.error(error);
    });
  }

  fetchUsers = () => {
    fetch('http://192.168.0.20:3000/api/v2/users?token=5b48a186f6334844b6cb3ccbfe77250c') /*using local network for testing API*/
    .then(response => response.json())
    .then(parsedJSON => parsedJSON.map(user => (
        {
          first_name: `${user.first_name}`,
          last_name: `${user.last_name}`,
          email: `${user.email}`,
          screen_name: `${user.screen_name}`,
          sub_company_name: `${user.sub_company_name}`,
          sub_company_abbreviation: `${user.sub_company_abbreviation}`,
          games_completed: `${user.games_completed}`,
          sub_company_id: `${user.sub_company_id}`,
          id: `${user.id}`,
        }
    )))
    .then(quizzifyUsers => this.setState({
        quizzifyUsers,
        isLoading: false
    }))
    .catch(error => console.log("parsing failes", error))
  }

  fetchGroups = () => {
    fetch('http://192.168.0.20:3000/api/v2/sub_company?token=5b48a186f6334844b6cb3ccbfe77250c') /*using local network for testing API*/
    .then(response => response.json())
    .then(parsedJSON => parsedJSON.map(group => (
        {
          id: `${group.id}`,
          name: `${group.name}`,
          abbreviation: `${group.abbreviation}`,
        }
    )))
    .then(companyGroups => this.setState({
        companyGroups,
    }))
    .catch(error => console.log("parsing failes", error))
    
  }
  render() {
    const {isLoading, quizzifyUsers, companyGroups} = this.state;
    const displayEmployeeID = quizzifyUsers.filter(u => u.employeeID !== 'null').length === 0;
    const displayGroup = quizzifyUsers.filter(u => u.groupName !== 'null').length === 0;

     const options = companyGroups.map(q => ({
       text: `${q.name} (${q.abbreviation})`,
       value: `${q.id}`
     }));
     console.log(options);
    return (
      <div className="App">
        <h1>User Management Demo</h1>
        <Button bsStyle="primary" onClick={this.handleShow}>
					Create a new Group for this company
				</Button>
        <Modal show={this.state.showModal} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Create new group</Modal.Title>
					</Modal.Header>
					<Modal.Body>
            <form onSubmit={this.handleSubmit}>
              <label>New Group Name
                <input type="text" value={this.state.newGroupName} style={{marginLeft:10}} onChange={this.handleChangeGroup}/>
              </label>
              <label>Group Abbreviation
                <input type="text" value={this.state.newGroupAbbreviation} style={{marginLeft:10}} onChange={this.handleChangeAbbre}/>
              </label>
              <input bsStyle="primary" type="submit" value="Submit" />
              </form>
          </Modal.Body>
					<Modal.Footer>
            <Button bsStyle="primary">Save changes</Button>
						<Button onClick={this.handleClose}>Close</Button>
					</Modal.Footer>
				</Modal>
      <hr/>
    {isLoading ? (
      <h1>loading ...</h1>
    ) : (
      <table className="table table-bordered table-striped">
        <tbody>
          <tr>
           <td>
             First Name
           </td>
           <td>
             Last Name
           </td>
           <td>
             Email
           </td>
           <td>
             Screen Name
           </td>
           <td>
             Group
           </td>
           <td>
             Employee ID
           </td>
          </tr>
          {
            !isLoading && quizzifyUsers.length > 0 ? quizzifyUsers.map((quizzifyUsers, i) =>{
              const {first_name,last_name,email,screen_name,sub_company_id,sub_company_name,sub_company_abbreviation,id} = quizzifyUsers;
              return <tr key={i}>
                <td>
                  <EditableTextField
                    name={i}
                    value={first_name}
                    onUpdate={this.handleUpdate}
                    placeholder='first_name'
                    />
                </td>
                <td>
                  <EditableTextField
                    name={i}
                    value={last_name}
                    onUpdate={this.handleUpdate}
                    placeholder='last_name'
                    />
                </td>
                <td>
                  <EditableTextField
                    name={i}
                    value={email}
                    onUpdate={this.handleUpdate}
                    placeholder='email'
                    />
                </td>
                <td>
                  <EditableTextField
                    name={i}
                    value={screen_name}
                    onUpdate={this.handleUpdate}
                    placeholder='screen_name'
                    />
                </td>
                <td>
                  <EditableSelect
                    name={i}
                    value={id}
                    onUpdate={this.handleUpdate}
                    defaultText={`${sub_company_name} (${sub_company_abbreviation})`}
                    placeholder='sub_company_id'
                    options={options}
                    />
                </td>
                <td>
                  <EditableTextField
                    name={i}
                    value={id}
                    onUpdate={this.handleUpdate}
                    placeholder='id'
                    />
                </td>
              </tr>
            }) :null
          }
        </tbody>
      </table>
    )}
      </div>
    );
  }
}

export default App;
