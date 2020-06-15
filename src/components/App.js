import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from "reactstrap"
import axios from "axios"
import unsplashToken from "../utilities/unsplashToken"

function App() {

	const [unsplashData, setUnsplashData] = useState([])

	useEffect(() => {
		axios.get(`https://api.unsplash.com/photos?page=1&client_id=${unsplashToken.accessKey}`)
			.then(function (response) {
				// handle success
				console.log(response);
				setUnsplashData(response.data)
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
	}, []);

	return (
		<Container className="App">
			<Row>
				{
					unsplashData ? unsplashData.map((image, index) => {
						return (
							<Col xs="6" sm="4" md="3" lg="2" key={index}>
								<img
									className="img-fluid"
									src={image.urls.regular ? image.urls.regular : 'placeholder.png'}
								/>
							</Col>
						)
					}) : null
				}
			</Row>
			<div id='bottom-for-scrollchecking'></div>
		</Container>
	);
}

export default App;