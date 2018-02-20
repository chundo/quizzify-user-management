import React, { Component } from 'react';
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


class Welcome extends Component {
	static propTypes = {
		name: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		email: PropTypes.string,
		screen_name: PropTypes.string,
		sub_company_id: PropTypes.string,
		id: PropTypes.string,
		checkboxUpdateUsers: PropTypes.bool,
		radioUpdateByEmail: PropTypes.bool,
		addUserShowModal: PropTypes.bool,
		deleteUserShowModal: PropTypes.bool,
		tempUserDelete: PropTypes.number,
		tempUserEmail: PropTypes.string,
		tempUserResendPassword: PropTypes.number,
		state_password_reset: PropTypes.number,
		url: PropTypes.string,
		tokent: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.state = {
			api_Username: '',
			api_user_token: '',
			company_name: '',
			company_id: '',

			isLoading: true,
			showModal: false,
			showModalFileUpload: false,
			quizzifyUsers: [],
			companyGroups: [],
			deleteUserShowModal: false,
			tempUserDelete: '',
			tempUserResendPassword: '',
			empUserEmail: '',
			state_password_reset: 0,
			url: 'http://f17107d8.ngrok.io',
		};
	}

	componentWillMount() {
		let jwt = window.localStorage.getItem('jwt');
		let result = jwtDecode(jwt);
		this.setState({
			api_Username: result.username,
			api_user_token: result.api_user_token,
			company_name: result.company_name,
			company_id: result.company_id,
		})
		console.log(result);
	}

	handleLogOut = () => {
		window.localStorage.removeItem('jwt');
		this.props.history.push('/');
	}

	componentDidMount() {
		this.fetchUsers(this.state.company_id,this.state.api_user_token);
		this.fetchGroups(this.state.company_id,this.state.api_user_token);
	}

	handleClose = () => {
		this.setState({
			deleteUserShowModal: false,
		});
	}

	handleTempUserDelete = (user_id, user_email) => {
		this.setState({
			deleteUserShowModal: true,
			tempUserDelete: user_id,
			tempUserEmail: user_email,
		})

	}

	handleDeleteUser = () => {
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		//console.log(user_id);
		const options = {
			method: 'DELETE',
			headers,
			body: JSON.stringify({ "id": this.state.tempUserDelete }),
		}
		const request = new Request(`${this.state.url}/api/v2/users/${this.state.tempUserDelete}?token=${this.state.api_user_token}`, options);
		fetch(request).then(response => {
			//console.log(response.status);
			if (response.status === 200) {
				this.handleClose();
				this.fetchUsers(this.state.company_id,this.state.api_user_token);
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
			body: JSON.stringify({ "user": quizzifyUsers[name] }) /*quizzifyUsers[name]*/
		}
		const request = new Request(`${this.state.url}/api/v2/users/${quizzifyUsers[name].id}?token=${this.state.api_user_token}`, options); /*using local network for testing API*/
		//console.log(JSON.stringify(quizzifyUsers[name]));
		fetch(request).then(response => {
			console.log(response.status);
			if (response.status === 200) {
				this.setState({ quizzifyUsers });
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

	fetchUsers = (company_id,token) => {
		//console.log(`${this.state.url}/api/v2/users?company=${company_id}&token=${token}`)
		fetch(`${this.state.url}/api/v2/users?company=${company_id}&token=${token}`) /*using local network for testing API*/
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
					state_password_reset: 0,
				}
			)))
			.then(quizzifyUsers => this.setState({
				quizzifyUsers,
				isLoading: false
			}))
			.catch(error => console.log(JSON.stringify(error)))
	}

	fetchGroups = (company_id,token) => {
		fetch(`${this.state.url}/api/v2/sub_company?company=${company_id}&token=${token}`) /*using local network for testing API*/
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
	handleResendPassword = (user_id, user_email, i) => {
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		const options = {
			method: 'POST',
			headers,
			body: JSON.stringify({ "id": user_id }),
		}
		let quizzifyTemp = this.state.quizzifyUsers;
		quizzifyTemp[i].state_password_reset = 1;
		this.setState({
			quizzifyUsers: quizzifyTemp,
		})
		const request = new Request(`${this.state.url}/api/v2/reset_password/${user_id}?token=${this.state.api_user_token}`, options);
		fetch(request).then(response => {
			if (response.status === 200) {
				quizzifyTemp[i].state_password_reset = 2;
				this.setState({
					quizzifyUsers: quizzifyTemp,
				})
			} else {
				alert(`Something went wrong, Use unique name for Emails and Employee IDs ${response.status}`);
			}
		})
	}


	render() {
		const { isLoading, quizzifyUsers, companyGroups } = this.state;
		//const displayEmployeeID = quizzifyUsers.filter(u => u.employeeID !== 'null').length === 0;
		//const displayGroup = quizzifyUsers.filter(u => u.groupName !== 'null').length === 0;

		const options = companyGroups.map(q => ({
			text: `${q.name} (${q.abbreviation})`,
			value: `${q.id}`
		}));
		return (
			<div>
				<div className="title" style={{ marginTop: 40 }}>
				<h1>{this.state.company_name}</h1><Button bsStyle="danger" onClick={() => this.handleLogOut()} style={{ marginTop: 11, marginLeft:20 }}>
                  Log Out <Glyphicon glyph="log-out" />
				        </Button>
								</div>
				<hr />
				<div className="TopButtons">

					<NewGroup url={this.state.url} company_id={this.state.company_id} token={this.state.api_user_token}/>
					<NewUser groups={companyGroups} reloadUsers={this.fetchUsers} url={this.state.url} company_id={this.state.company_id} token={this.state.api_user_token}/>
					<UploadXlsx reloadUsers={this.fetchUsers} url={this.state.url} company_id={this.state.company_id} token={this.state.api_user_token}/>
				</div>

				<Modal show={this.state.deleteUserShowModal} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Delete User</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<center>
							<h5>Are you sure you want to delete <strong>{`${this.state.tempUserEmail}`}</strong>?</h5>
							<Button bsStyle="danger" onClick={this.handleDeleteUser} style={{ margin: 20 }}>Delete</Button> {/*() => this.handleDeleteUser(id)*/}
							<Button onClick={this.handleClose}>Cancel</Button>
						</center>
					</Modal.Body>
				</Modal>

				<hr/>
    {isLoading ? (
      <div>
      <h1>loading ...</h1>
      <img src={loader} alt='Loading...'/>
      </div>
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
           <td>
             Reset Password
           </td>
           <td>
             Delete
           </td>
          </tr>
          {
            !isLoading && quizzifyUsers.length > 0 ? quizzifyUsers.map((quizzifyUsers, i) =>{
              const {first_name,last_name,email,screen_name,sub_company_id,sub_company_name,sub_company_abbreviation,employee_id,id,state_password_reset} = quizzifyUsers;
              return <tr key={i}>
                <td style={{paddingTop:15}}>
                  <EditableTextField
                    name={i}
                    value={first_name}
                    onUpdate={this.handleUpdate}
                    placeholder='first_name'
                    />
                </td>
                <td style={{paddingTop:15}}>
                  <EditableTextField
                    name={i}
                    value={last_name}
                    onUpdate={this.handleUpdate}
                    placeholder='last_name'
                    />
                </td>
                <td style={{paddingTop:15}}>
                  <EditableTextField
                    name={i}
                    value={email}
                    onUpdate={this.handleUpdate}
                    placeholder='email'
                    />
                </td>
                <td style={{paddingTop:15}}>
                  <EditableTextField
                    name={i}
                    value={screen_name===null || screen_name==='null'?'N/A':screen_name}
                    onUpdate={this.handleUpdate}
                    placeholder='screen_name'
                    />
                </td>
                <td style={{paddingTop:15}}>
                  <EditableSelect
                    name={i}
                    value={id}
                    onUpdate={this.handleUpdate}
                    defaultText={sub_company_name==='null' && sub_company_abbreviation==='null' ? 'N/A':`${sub_company_name} (${sub_company_abbreviation})`}
                    placeholder='sub_company_id'
                    options={options}
                    />
                </td>
                <td style={{paddingTop:15}}>
                  <EditableTextField
                    name={i}
                    value={employee_id===null || employee_id==='null'? 'N/A':employee_id}
                    onUpdate={this.handleUpdate}
                    placeholder='employee_id'
                    />
                </td>
                {
                  (() => {
                    switch(state_password_reset) {
                        case 0:
                            return <td><Button bsStyle="primary" onClick={() => this.handleResendPassword(id,email,i)} >
                            Send Password reset
                           </Button></td>;
                        case 1:
                            return <td><img src={loader} alt='Loading...' width='35' height='35'/></td>;
                        case 2:
                            return <td style={{paddingTop:15}}>
                            <strong style={{color:'green'}}>
                             Sent <Glyphicon glyph="ok" />
                            </strong>
                            </td>;
                        default:
                            return null;
                    }
                })()
                }
            <td>
                <Button bsStyle="danger" onClick={() => this.handleTempUserDelete(id,email)}>
                  <Glyphicon glyph="trash" />
				        </Button>
                </td>
              </tr>
            }) :null
          }
        </tbody>
      </table>
    )}
			</div>
		)
	}


}

export default Welcome;