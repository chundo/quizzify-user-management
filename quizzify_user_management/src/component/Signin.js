import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { Jumbotron } from 'react-bootstrap';

class Signin extends Component {

	componentDidMount(){
		console.log(this.props.match);
	}

	handleSubmit = event => {
		
		event.preventDefault();
		//console.log(this.inputNode1.value);
		//console.log(this.inputNode2.value);
		var formData = new FormData();
		formData.append("username", this.inputNode1.value);
		formData.append("password", this.inputNode2.value);

		fetch("http://35acbfab.ngrok.io/token_aut",
			{ method: 'POST', body: formData })
			.then(res => res.json()).then(res => (console.log(res.jwt),
				window.localStorage.setItem('jwt', res.jwt)
			))
			.then(() => this.props.history.push('/welcome'))
			.catch(function (error) { console.log('Este es un error': error.message) });

	}

	render() {
		return (

			<div style={{ padding: 30 }}>
				<Form horizontal>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={6}>
							Username
			        </Col>
						<Col sm={2}>
							<FormControl type="text" placeholder="Enter your username" />
						</Col>
					</FormGroup>
					<FormGroup>
						<Col componentClass={ControlLabel} sm={6}>
							Password
			        </Col>
						<Col sm={2}>
							<FormControl type="text" placeholder="Enter your password" />
						</Col>
					</FormGroup>
					<Button bsStyle="primary" 
					type="submit" onSubmit={this.handleSubmit}>Submit</Button>
				</Form>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor='username'>Username</label><br />
					<input type='username' id='username' name='username' ref={node => { this.inputNode1 = node }} />
					<br />
					<label htmlFor='username'>Password</label><br />
					<input type='password' id='password' name='password' ref={node => { this.inputNode2 = node }} />
					<br />
					<input type='submit' value='Sign In' />
				</form>
			</div>

		)
	}
}

export default Signin;