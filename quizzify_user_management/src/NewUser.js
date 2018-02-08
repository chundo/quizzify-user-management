import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';

import loader from './assets/loader.svg';

class NewUser extends Component {
    static propTypes = {
        newUserFirstName: PropTypes.string,
        newUserLastName: PropTypes.string,
        newUserEmail: PropTypes.string,
        newUserScreenName: PropTypes.string,
        newUserGroup: PropTypes.string,
        newUserCompanyId: PropTypes.number,

        emailAlert: PropTypes.bool,
        isLoading: PropTypes.bool,
        
    }
    constructor(props) {
        super(props);
        this.state = {
            newUserFirstName: undefined,
            newUserLastName: undefined,
            newUserEmail: undefined,
            newUserScreenName: undefined,
            newUserGroup: undefined,
            newUserEmployeeId: undefined,
            showModal: false,
            emailAlert: false,
            isLoading: false,
        }
    }

    handleClose = () => {
		this.setState({ 
            newUserFirstName: undefined,
            newUserLastName: undefined,
            newUserEmail: undefined,
            newUserScreenName: undefined,
            newUserGroup: undefined,
            newUserEmployeeId: undefined,
            showModal: false,
            emailAlert: false,
            isLoading: false,
        });
    }

	handleShow = () => {                
		this.setState({ showModal: true });
    }

    handleNewFirstName = (event) => {
        event.preventDefault()
        this.setState({
          newUserFirstName: event.target.value,
        })
    }
    handleNewFirstName = (event) => {
        event.preventDefault()
        this.setState({
          newUserFirstName: event.target.value,
        })
    }    
    handleNewLastName = (event) => {
        event.preventDefault()
        this.setState({
          newUserLastName: event.target.value,
        })
    }

    handleNewEmail = (event) => {
        event.preventDefault()
        this.setState({
          newUserEmail: event.target.value,
        })
    }
    handleNewScreenName = (event) => {
        event.preventDefault()
        this.setState({
            newUserScreenName: event.target.value,
        })
    }
    handleNewGroup = (event) => {
        event.preventDefault()
        this.setState({
            newUserGroup: event.target.value,
        })
    }
    handleNewEmployeeID = (event) => {
        event.preventDefault()
        this.setState({
            newUserEmployeeId: event.target.value,
        })
    }
    handleCreateUser = () =>{
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = {
          method: 'POST',
          headers,
          body: JSON.stringify({"user": {"first_name":this.state.newUserFirstName,"last_name":this.state.newUserLastName,"email":this.state.newUserEmail,"screen_name":this.state.newUserScreenName,"sub_company_id":this.state.newUserGroup,"employee_id":this.state.newUserEmployeeId}}),
        }
        //console.log(options);
        const request = new Request(`${this.props.url}/api/v2/users?token=5b48a186f6334844b6cb3ccbfe77250c`, options); /*using local network for testing API*/  
        this.setState({
            isLoading:true,
        })
        this.state.newUserEmail === undefined?(this.setState({
            emailAlert:true,
            isLoading:false,
        })):(
            fetch(request).then(response => {
              console.log(response.status);
            if (response.status === 200) {
              this.handleClose();
              this.props.reloadUsers();
              //window.location.reload();
            } else {
              alert(`User may exist with the same information. Error:${response.status}`);
            }
            }).catch(error => console.log(error)
        )
    )
        
    }
    
    render() {
        return(
            <div>
            <Button bsStyle="primary" style={{marginLeft:20}} onClick={this.handleShow}>
            <Glyphicon glyph="user" /> Create new user
            </Button>
            <Modal show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create new user</Modal.Title>
            </Modal.Header>
            <Modal.Body>
             <Form horizontal>
               <FormGroup>
               <Col componentClass={ControlLabel} sm={4}>
                  First Name
             </Col>
              <Col sm={8}>
                <FormControl type="text" value={this.state.newUserFirstName} placeholder="Enter new user's first name" onChange={this.handleNewFirstName}/>
            </Col>
             </FormGroup>
              <FormGroup>
             <Col componentClass={ControlLabel} sm={4}>
                Last Name
            </Col>
              <Col sm={8}>
                <FormControl type="text" value={this.state.newUserLastName} placeholder="Enter new user's last name" onChange={this.handleNewLastName}/>
            </Col>
            </FormGroup>  
            <FormGroup>
             <Col componentClass={ControlLabel} sm={4}>
                Email*
            </Col>
              <Col sm={8}>
                <FormControl type="email" value={this.state.newUserEmail} placeholder="Enter new user's email" onChange={this.handleNewEmail}/>
            </Col>
            </FormGroup> 
            <FormGroup>
             <Col componentClass={ControlLabel} sm={4}>
                Screen Name
            </Col>
              <Col sm={8}>
                <FormControl type="email" value={this.state.newUserScreenName} placeholder="Enter new user's screen name" onChange={this.handleNewScreenName}/>
            </Col>
            </FormGroup>    
            <FormGroup>
             <Col componentClass={ControlLabel} sm={4}>
                Group
            </Col>
              <Col sm={8}>
                <FormControl componentClass="select" placeholder="Select new user's group" onChange={this.handleNewGroup}>
                <option>None</option>
                {
                    this.props.groups.map(q => (
                    <option value={q.id} key={q.id}>
                       {`${q.name} (${q.abbreviation})`}
                    </option>
                ))
                
                }
                </FormControl>
            </Col>
            </FormGroup>    
            <FormGroup>
             <Col componentClass={ControlLabel} sm={4}>
                Employee ID
            </Col>
              <Col sm={8}>
                <FormControl type="text" value={this.state.newUserEmployeeId} placeholder="Enter new user's employee ID" onChange={this.handleNewEmployeeID}/>
            </Col>
            </FormGroup>         
            </Form>
            {
                this.state.emailAlert ? (
                    <Alert bsStyle="danger">
                    <p><strong style={{marginLeft:40}}> · Email is missing:</strong> Please enter an email</p>
                    </Alert>
                ):null
            }
            </Modal.Body>
            <Modal.Footer>
                { this.state.isLoading?(<img src={loader} alt='Loading...' width='50' height='50'style={{marginRight:30}} />):(<Button bsStyle="primary" onClick={this.handleCreateUser}>Create new User</Button>)}
              
            <Button onClick={this.handleClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
        </div>
        );
    }
}

export default NewUser; 
