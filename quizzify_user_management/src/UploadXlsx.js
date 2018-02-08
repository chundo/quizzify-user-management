import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Checkbox } from 'react-bootstrap';
import { Radio } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';

import loader from './assets/loader.svg';

export default class UploadXlsx extends Component {
    static propTypes = {
        showModalFileUpload: PropTypes.bool,
        checkboxUpdateUsers: PropTypes.bool,
        radioUpdateByEmail: PropTypes.bool,
        radioUpdateByID: PropTypes.bool,
        isLoadingFile: PropTypes.bool,
    }
    constructor(props){
        super(props);
        this.state = {
            showModalFileUpload: false,
            file: null,
            checkboxUpdateUsers: true,
            radioUpdateByEmail: true,
            radioUpdateByID: false,
            isLoadingFile: false,
        }
    }
    handleShowFileUpload = () => {              
		this.setState({ showModalFileUpload: true });
    }
    handleClose = () => {
	  this.setState({ 
      showModalFileUpload: false,
      radioUpdateByEmail: true,
      file: null,
      isLoadingFile: false,
    });
	}
    handleChangeFile = (event) => {
        this.setState({ file: event.target.files[0] }); 
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
        this.setState({ loadingFile:true})
        const request = new Request(`${this.props.url}/admin/email_importer?token=5b48a186f6334844b6cb3ccbfe77250c`,options);
        fetch(request)
        .then(response => {
        if (response.status === 200) {
          this.handleClose();
          this.props.reloadUsers();
          return response.json()
        } else {
          alert(`Something went wrong, Please try again ... ${response.status}`);
          throw new Error('Something went wrong on api server!');
        }
        }).then(
          response => {
            alert(`Updated users:${response.update} Created users:${response.create}`)
          }
        )
        .catch(error => console.log(error))
    }
    render (){
        return(
            <div>
                <Button bsStyle="success" style={{marginLeft:20}} onClick={this.handleShowFileUpload}>
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
            <p style={{marginTop:15}}>{this.state.file!==null?<Glyphicon glyph="file"/>:null}{this.state.file!==null?this.state.file.name:null}</p>
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
                        {this.state.isLoadingFile ? 
                        (<img src={loader} alt='Loading...' width='50' height='50'style={{marginRight:30}}/>):
                        (<Button bsStyle="primary" onClick={this.handleFileSubmit} disabled={this.state.file === null} >Send File</Button>)  
                        }
            
						<Button onClick={this.handleClose}>Cancel</Button>
					</Modal.Footer>
				</Modal>
            </div>
    
        )
    }
}