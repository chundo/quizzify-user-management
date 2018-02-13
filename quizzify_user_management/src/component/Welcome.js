import React, {Component} from 'react';
import jwtDecode from 'jwt-decode';

import PropTypes from 'prop-types';
import EditableTextField from '../Xeditable/EditableTextField';
import EditableSelect from '../Xeditable/EditableSelect';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import NewUser from '../NewUser.js';
import NewGroup from '../NewGroup.js';
import UploadXlsx from '../UploadXlsx.js'
import loader from '../assets/loader.svg';


class Welcome extends Component{
	static propTypes = {
		name: PropTypes.string,
		first_name:PropTypes.string,
		last_name:PropTypes.string,
		email:PropTypes.string,
		screen_name:PropTypes.string,
		sub_company_id:PropTypes.string,
		id:PropTypes.string,
		checkboxUpdateUsers: PropTypes.bool,
		radioUpdateByEmail: PropTypes.bool,
		addUserShowModal: PropTypes.bool,
		deleteUserShowModal: PropTypes.bool,
		tempUserDelete: PropTypes.number,
		tempUserEmail: PropTypes.string,
		tempUserResendPassword: PropTypes.number,
		sent_password_reset: PropTypes.bool,
		state_password_reset: PropTypes.number,
		url: PropTypes.string,
		tokent: PropTypes.string,
	  };

	  constructor(props) {
		super(props);
		this.state = {
		  isLoading: true ,
		  showModal: false,
		  showModalFileUpload: false,
		  quizzifyUsers: [],
		  companyGroups: [],
		  deleteUserShowModal: false,
		  tempUserDelete: '',
		  tempUserResendPassword: '',
		  empUserEmail: '',
		  sent_password_reset: false,
		  state_password_reset: 0,
		  url: 'http://35acbfab.ngrok.io',
		  token: '5b48a186f6334844b6cb3ccbfe77250c',
		 };
	  }

	state = {username: undefined}
	componentDidMount(){
		let jwt = window.localStorage.getItem('jwt');
		let result = jwtDecode(jwt);
		this.setState({
			username: result.username,
			api_user_token: result.api_user_token,
			company_name: result.company_name,	
		})
		//console.log(result);
	}

	handleClose = () => {
		this.setState({ 
    	  deleteUserShowModal: false,
    	});
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
		const request = new Request(`${this.state.url}/api/v2/users/${this.state.tempUserDelete}?token=5b48a186f6334844b6cb3ccbfe77250c`, options);
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
		
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
	
		const options = {
		  method: 'PUT',
		  headers,
		  body: JSON.stringify({ "user": quizzifyUsers[name]}) /*quizzifyUsers[name]*/
		}
		const request = new Request(`${this.state.url}/api/v2/users/${quizzifyUsers[name].id}?token=${this.state.token}`, options); /*using local network for testing API*/
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

	fetchUsers = () => {
		fetch(`${this.state.url}/api/v2/users?company=2&token=${this.state.token}`) /*using local network for testing API*/
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
			  sent_password_reset: false,
			  state_password_reset: 0,
			}
		)))
		.then(quizzifyUsers => this.setState({
			quizzifyUsers,
			isLoading: false
		}))
		.catch(error => console.log(JSON.stringify(error)))
	  }

	  fetchGroups = () => {
		fetch(`${this.state.url}/api/v2/sub_company?company=2&token=5b48a186f6334844b6cb3ccbfe77250c`) /*using local network for testing API*/
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
	  handleResendPassword = (user_id, user_email,i) =>{
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		const options = {
		  method: 'POST',
		  headers,
		  body: JSON.stringify({ "id": user_id}),
		}
		let quizzifyTemp = this.state.quizzifyUsers;
		quizzifyTemp[i].state_password_reset=1;
		this.setState({
		  quizzifyUsers: quizzifyTemp,
		})
		const request = new Request(`${this.state.url}/api/v2/reset_password/${user_id}?token=5b48a186f6334844b6cb3ccbfe77250c`, options);
		fetch(request).then(response =>{
		  if (response.status === 200) {
			quizzifyTemp[i].state_password_reset = 2;
			quizzifyTemp[i].sent_password_reset = true;
			this.setState({
			  quizzifyUsers: quizzifyTemp,
			})
		  } else {
			alert(`Something went wrong, Use unique name for Emails and Employee IDs ${response.status}`);
		  }
		})
	  }


	render(){
		return(
			<div>
				<h1 style={{margin:40}}>{this.state.company_name} </h1>
			</div>
		)
	}


}

export default Welcome;