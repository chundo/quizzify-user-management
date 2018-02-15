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

class NewGroup extends Component {
    static propTypes = {
        newGroupName: PropTypes.string,
        newGroupAbbreviation: PropTypes.string,
        showModal: PropTypes.bool,
        alertVisible: PropTypes.bool,
    }
    constructor(props){
        super(props);
        this.state = {
            newGroupName: '',
            newGroupAbbreviation: '',
            showModal: false,
            alertVisible: false,
        }
    }
    handleClose = () => {
	    this.setState({ 
            showModal: false,
            alertVisible: false,
        });
    }
    handleShow = () => {                
      this.setState({ showModal: true });
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
    handleGroupSubmit = () =>{
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
     
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify({"sub_company": {"company_id":this.props.company_id,"name":this.state.newGroupName,"abbreviation":this.state.newGroupAbbreviation}}),
    }
    console.log(this.props.token);
    const request = new Request(`${this.props.url}/api/v2/sub_company?company=${this.props.company_id}&token=${this.props.token}`, options); /*using local network for testing API*/  
    
    this.state.newGroupName === ''&& this.state.newGroupAbbreviation === '' ? (this.setState({
      alertVisible: true
    })):(
    fetch(request).then(response => {
      console.log(response.status);
    if (response.status === 200) {
      //this.setState({ showModal: false });
      window.location.reload();  //Reloads the page due to limitations from XEditable to set states for select options
    } else {
      alert(`Group may already exist ${response.status}`);
    }
    }).catch(error => console.log(error)));
  }
  render() {
    return(
        <div>
             <Button bsStyle="primary" onClick={this.handleShow}>
                <Glyphicon glyph="plus" /> Create a new Group
			</Button>

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
              this.state.alertVisible ? (
                <Alert bsStyle="danger">
                <p>Fill one of the previews fields before saving changes</p>
                </Alert>
              ) : null
            }
          </Modal.Body>
					<Modal.Footer>
            <Button bsStyle="primary" onClick={this.handleGroupSubmit}>Create Group</Button>
						<Button onClick={this.handleClose}>Cancel</Button>
					</Modal.Footer>
				</Modal>
        </div>
    )
  }

}

export default NewGroup;