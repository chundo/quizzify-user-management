import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';


class Signin extends Component {

	constructor(props) {
		super(props);
		this.state = {
			userEmail: '',
			userPassword: '',
			alert: true,
		}
	}

	componentWillMount() {
		(localStorage.getItem('jwt') === null) ? (null):(this.props.history.push('/welcome'));
	}
	handleUserEmail = (event) => {
		event.preventDefault()
		this.setState({
			userEmail: event.target.value,
		})
	}

	handleUserPassword = (event) => {
		event.preventDefault()
		this.setState({
			userPassword: event.target.value,
		})
	}

	handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append('username', this.state.userEmail);
		formData.append('password', this.state.userPassword);

		fetch("http://f17107d8.ngrok.io/token_aut",
			{ method: 'POST', body: formData })
			.then(res => res.json()).then(res => (
				window.localStorage.setItem('jwt', res.jwt)
			))
			.then(() => this.props.history.push('/welcome'))
			.catch(function (error) { alert('An error happened, please make sure your Email and Password are correct') });
	}


	render() {
		return (

			<div style={{ padding: 80 }}>
				<Form horizontal>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={6}>
							Username
			        </Col>
						<Col sm={2}>
							<FormControl type="text" value={this.state.userEmail} onChange={this.handleUserEmail} placeholder="Enter your username" />
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={6}>
							Password
			        </Col>
						<Col sm={2}>
							<FormControl type="password" value={this.state.userPassword} onChange={this.handleUserPassword} placeholder="Enter your password" />
						</Col>
					</FormGroup>
					<Button type="submit" bsStyle="primary" onClick={this.handleSubmit}>Submit</Button>
				</Form>
			</div>

		)
	}
}

export default Signin;