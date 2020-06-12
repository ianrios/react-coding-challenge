import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from "reactstrap"
import axios from "axios"
import unsplashToken from "../utilities/unsplashToken"
import './App.css';

function App() {

	const [unsplashData, setUnsplashData] = useState({})

	useEffect(() => {
		const data = { headers: { Authorization: `Client-ID ${unsplashToken.accessKey}` } }
		axios.get('https://api.unsplash.com/photos/curated', data)
			.then(function (response) {
				// handle success
				console.log(response);
				setUnsplashData(response)
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
	}, [unsplashData]);

	return (
		<Container className="App">
			<Row>
				<Col xs="12" sm="4" md="3" lg="2">
					react challenge app
				</Col>
			</Row>
		</Container>
	);
}

export default App;
