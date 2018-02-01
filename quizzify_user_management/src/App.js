import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableTextField from './Xeditable/EditableTextField';
import EditableSelect from './Xeditable/EditableSelect';
import './App.css';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import { Checkbox } from 'react-bootstrap';
import { Radio } from 'react-bootstrap';
import NewUser from './NewUser';




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
    alertVisible: PropTypes.bool,
    checkboxUpdateUsers: PropTypes.bool,
    radioUpdateByEmail: PropTypes.bool,
    addUserShowModal: PropTypes.bool,
    deleteUserShowModal: PropTypes.bool,
    tempUserDelete: PropTypes.number,
    tempUserEmail: PropTypes.string,

  };
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true ,
      alertVisible: false,
      showModal: false,
      showModalFileUpload: false,
      quizzifyUsers: [],
      companyGroups: [],
      newGroupName: '',
      newGroupAbbreviation: '',
      file: null,
      checkboxUpdateUsers: true,
      radioUpdateByEmail: true,
      radioUpdateByID: false,
      deleteUserShowModal: false,
      tempUserDelete: '',
      empUserEmail: '',
     };
  }

  componentDidMount(){
    this.fetchUsers();
    this.fetchGroups();
  }

  handleClose = () => {
		this.setState({ 
      showModal: false,
      alertVisible: false,
      showModalFileUpload: false,
      radioUpdateByEmail: true,
      deleteUserShowModal: false,
      file: null,
    });
	}

	handleShow = () => {                
		this.setState({ showModal: true });
  }

  handleShowFileUpload = () => {              
		this.setState({ showModalFileUpload: true });
  }

  handleChangeFile = (event) => {
    this.setState({ file: event.target.files[0] }); 
  }

  handleChangeGroup = (event) => {    //get the keystrokes in the text field and updates the state
    this.setState({
      newGroupName: event.target.value,
    });
  }

  handleChangeAbbre = (event) => {   //get the keystrokes in the text field and updates the state
    this.setState({
      newGroupAbbreviation: event.target.value,
    });
  }
  handleChangeUpdateUsers = (event) => {
    this.setState({ checkboxUpdateUsers: event.target.checked });
    //this.setState({ checkboxUpdateUsers: !this.state.checkboxUpdateUsers });
  }
  handleChangeRadioByEmail = (event) => {
    this.setState({ radioUpdateByEmail: event.target.checked });
  }
  handleChangeRadioByID = () => {
    this.setState({ radioUpdateByEmail: false });
  }

  handleFileSubmit = () => {
    const headers = new Headers();
    //headers.append('content-type', 'multipart/form-data');
    const formData = new FormData();
    //console.log(this.state.file)
    //console.log(this.state.checkboxUpdateUsers)
    //console.log(this.state.radioUpdateByEmail)
    formData.append('file',this.state.file);
    formData.append('update',this.state.checkboxUpdateUsers);
    formData.append('by_email', this.state.radioUpdateByEmail);

    const options = {
      method: 'POST',
      headers,
      body: formData
    };
    const request = new Request(`http://192.168.0.13:3000/admin/email_importer?token=5b48a186f6334844b6cb3ccbfe77250c`,options);
    fetch(request)
    .then(response => {
    if (response.status === 200) {
      this.handleClose();
      this.fetchUsers();
      return response.json()
    } else {
      alert(`Something went wrong, Please try again ... ${response.status}`);
      throw new Error('Something went wrong on api server!');
    }
    }).then(
      response => {
        alert(`Updated users:${response.update} Created users:${response.create}`)
        // console.log(response.update)
        // console.log(response.create)
      }
    )
    .catch(error => console.log(error))
  }

  handleGroupSubmit = () =>{
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify({"sub_company": {"company_id":"7","name":this.state.newGroupName,"abbreviation":this.state.newGroupAbbreviation}}),
    }
    //console.log(options);
    const request = new Request(`http://192.168.0.13:3000/api/v2/sub_company?token=5b48a186f6334844b6cb3ccbfe77250c`, options); /*using local network for testing API*/  
    
    this.state.newGroupName === ''&& this.state.newGroupAbbreviation === '' ? (this.setState({
      alertVisible: true
    })):(
    fetch(request).then(response => {
      console.log(response.status);
    if (response.status === 200) {
      this.setState({ showModal: false });
      window.location.reload();  //Reloads the page due to limitations from XEditable to set states for select options
    } else {
      alert(`Group may already exist ${response.status}`);
    }
    }).catch(error => console.log(error)));
  }
  handleTempUserDelete = (user_id, user_email) =>{
    this.setState({
      deleteUserShowModal: true,
      tempUserDelete: user_id,
      tempUserEmail: user_email,
    })
    
  }
  handleDeleteUser = () =>{
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //console.log(user_id);
    const options = {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ "id": this.state.tempUserDelete}),
    }
    const request = new Request(`http://192.168.0.13:3000/api/v2/users/${this.state.tempUserDelete}?token=5b48a186f6334844b6cb3ccbfe77250c`, options);
    fetch(request).then(response =>{
      //console.log(response.status);
      if (response.status === 200) {
        this.handleClose();
        this.fetchUsers();
      } else {
        alert(`Something went wrong, Use unique name for Emails and Employee IDs ${response.status}`);
      }
    })
  }

  handleUpdate = (name, value, placeholder) => { /*Name: position in the array (i), Value: the new value to exchange, Placeholder: name of the attribute in the object to change*/
    let quizzifyUsers = this.state.quizzifyUsers;
    quizzifyUsers[name][placeholder] = value; /* name is a number to access the object, placeholder identifies the atribute to modify in the object  */
    
    const repetedEmployeeEmail = quizzifyUsers.filter(u => u.email !== value).length === 0;
    console.log(repetedEmployeeEmail);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'PUT',
      headers,
      body: JSON.stringify({ "user": quizzifyUsers[name]}) /*quizzifyUsers[name]*/
    }
    const request = new Request(`http://192.168.0.13:3000/api/v2/users/${quizzifyUsers[name].id}?token=5b48a186f6334844b6cb3ccbfe77250c`, options); /*using local network for testing API*/
    //console.log(JSON.stringify(quizzifyUsers[name]));
    fetch(request).then(response => {
      console.log(response.status);
    if (response.status === 200) {
      this.setState({quizzifyUsers});
    } else {
      alert(`Something went wrong, Use unique name for Emails and Employee IDs ${response.status}`);
    }
  })
  .then(response => {
    console.debug(response);
    // ...
    }).catch(error => {
    console.error(error);
    });
  }

  handleUploadFile = (event) => {
    const formData = new FormData();
    formData.append('File',event.target.files[0]);
    fetch('http://192.168.0.13:3000/admin/email_importer?token=5b48a186f6334844b6cb3ccbfe77250c',{
      method: 'POST',
      headers:{
        'content-type': 'multipart/form-data'
      },
      body: formData
    }
  ).then(response => {
    console.log(response.status);
  if (response.status === 200) {
    this.setState({ showModal: false });
  } else {
    alert(`Something went wrong, Please try again ... ${response.status}`);
    throw new Error('Something went wrong on api server!');
  }
  })
  .catch(error => console.log(error))
    //console.log(event.target.files[0]);
  }
  fetchUsers = () => {
    fetch('http://192.168.0.13:3000/api/v2/users?token=5b48a186f6334844b6cb3ccbfe77250c') /*using local network for testing API*/
    .then(response => response.json())
    .then(parsedJSON => parsedJSON.map(user => (
        {
          id: `${user.id}`,
          first_name: `${user.first_name}`,
          last_name: `${user.last_name}`,
          email: `${user.email}`,
          screen_name: `${user.screen_name}`,
          sub_company_name: `${user.sub_company_name}`,
          sub_company_abbreviation: `${user.sub_company_abbreviation}`,
          sub_company_id: `${user.sub_company_id}`,
          employee_id: `${user.employee_id}`,
        }
    )))
    .then(quizzifyUsers => this.setState({
        quizzifyUsers,
        isLoading: false
    }))
    .catch(error => console.log(JSON.stringify(error)))
  }

  fetchGroups = () => {
    fetch('http://192.168.0.13:3000/api/v2/sub_company?token=5b48a186f6334844b6cb3ccbfe77250c') /*using local network for testing API*/
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
    const {isLoading, alertVisible, quizzifyUsers, companyGroups, file} = this.state;
    //const displayEmployeeID = quizzifyUsers.filter(u => u.employeeID !== 'null').length === 0;
    //const displayGroup = quizzifyUsers.filter(u => u.groupName !== 'null').length === 0;
    
     const options = companyGroups.map(q => ({
       text: `${q.name} (${q.abbreviation})`,
       value: `${q.id}`
     }));
     
    return (
      <div className="App">
        <h1 style={{margin:40}}>User Management Demo</h1>
        <hr/>
        <Button bsStyle="primary" onClick={this.handleShow}>
        <Glyphicon glyph="plus" /> Create a new Group
				</Button>

        <NewUser groups={companyGroups} reloadUsers={this.fetchUsers}/>

        <Button bsStyle="success" onClick={this.handleShowFileUpload}>
          <Glyphicon glyph="cloud-upload" /> Upload spreadsheet
				</Button>

        <Modal show={this.state.showModalFileUpload} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Upload spreadsheet to add/edit multiple users</Modal.Title>
					</Modal.Header>
				  <Modal.Body>
          <Form horizontal>
            <center>
            <input className="inputfile" id="inputXLS" type="file" label='Upload' accept='.xlsx,.xls' onChange={this.handleChangeFile} />
            <label htmlFor="inputXLS" className="btn btn-success"><Glyphicon glyph="cloud-upload" /> Select File</label> 
            <p style={{marginTop:15}}>{file!==null?<Glyphicon glyph="file"/>:null}{file!==null?file.name:null}</p>
            <Checkbox checked={this.state.checkboxUpdateUsers} onChange={this.handleChangeUpdateUsers}>Update existing users if applicable</Checkbox>
            {this.state.checkboxUpdateUsers?
            <div>
              <Radio name="groupOptions" inline checked={this.state.radioUpdateByEmail} onChange={this.handleChangeRadioByEmail}>By Email</Radio>
              <Radio name="groupOptions" inline onChange={this.handleChangeRadioByID}>By Employee ID</Radio>  
            </div> 
              :null}
            </center>
          </Form>
          </Modal.Body>
					<Modal.Footer>
            <Button bsStyle="primary" onClick={this.handleFileSubmit} disabled={file === null} >Send File</Button>
						<Button onClick={this.handleClose}>Close</Button>
					</Modal.Footer>
				</Modal>
 
        <Modal show={this.state.showModal} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Create new group</Modal.Title>
					</Modal.Header>
					<Modal.Body>
            <Form horizontal>
              <FormGroup>
              <Col componentClass={ControlLabel} sm={4}>
                New Group Name
			        </Col>
              <Col sm={8}>
				        <FormControl type="text" value={this.state.newGroupName} placeholder="Enter new group's name" onChange={this.handleChangeGroup}/>
			        </Col>
              </FormGroup>
              <FormGroup>
              <Col componentClass={ControlLabel} sm={4}>
                Abbreviation
			        </Col>
              <Col sm={8}>
				        <FormControl type="text" value={this.state.newGroupAbbreviation} placeholder="Enter new group's abbreviation" onChange={this.handleChangeAbbre}/>
			        </Col>
              </FormGroup>             
            </Form>
            {
              alertVisible ? (
                <Alert bsStyle="danger">
                <p>Fill one of the previews fields before saving changes</p>
                </Alert>
              ) : null
            }
          </Modal.Body>
					<Modal.Footer>
            <Button bsStyle="primary" onClick={this.handleGroupSubmit}>Save changes</Button>
						<Button onClick={this.handleClose}>Close</Button>
					</Modal.Footer>
				</Modal>

        <Modal show={this.state.deleteUserShowModal} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Delete User</Modal.Title>
					</Modal.Header>
					<Modal.Body>
            <center>
            <h5>Are you sure you want to delete {`${this.state.tempUserEmail}`}?</h5>
          <Button bsStyle="danger" onClick={this.handleDeleteUser} style={{margin:20}}>Delete</Button> {/*() => this.handleDeleteUser(id)*/}
					<Button onClick={this.handleClose}>Cancel</Button>
          </center>
          </Modal.Body>		
				</Modal>

      <hr/>
    {isLoading ? (
      <h1>loading ...</h1>
    ) : (
      <table className="table table-bordered table-striped">
        <tbody>
          <tr>
          <td>
             Delete
           </td>
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
           <td>
             Reset Password
           </td>
          </tr>
          {
            !isLoading && quizzifyUsers.length > 0 ? quizzifyUsers.map((quizzifyUsers, i) =>{
              const {first_name,last_name,email,screen_name,sub_company_id,sub_company_name,sub_company_abbreviation,employee_id,id} = quizzifyUsers;
              return <tr key={i}>
                <td>
                <Button bsStyle="danger" onClick={() => this.handleTempUserDelete(id,email)}>
                  <Glyphicon glyph="trash" />
				        </Button>
                </td>
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
                    value={screen_name===null || screen_name==='null'?'N/A':screen_name}
                    onUpdate={this.handleUpdate}
                    placeholder='screen_name'
                    />
                </td>
                <td>
                  <EditableSelect
                    name={i}
                    value={id}
                    onUpdate={this.handleUpdate}
                    defaultText={sub_company_name==='null' && sub_company_abbreviation==='null' ? 'N/A':`${sub_company_name} (${sub_company_abbreviation})`}
                    placeholder='sub_company_id'
                    options={options}
                    />
                </td>
                <td>
                  <EditableTextField
                    name={i}
                    value={employee_id===null || employee_id==='null'? 'N/A':employee_id}
                    onUpdate={this.handleUpdate}
                    placeholder='employee_id'
                    />
                </td>
                <td>
                  <Button bsStyle="primary" >
					          Send Password reset
				          </Button>
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
