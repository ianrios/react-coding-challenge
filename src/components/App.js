import React, { useEffect, useReducer } from 'react';
import { Container, Row, Col } from "reactstrap"
import axios from "axios"
import unsplashToken from "../utilities/unsplashToken"

function App() {

	const imageReducer = (state, action) => {
		switch (action.type) {
			case 'PUSHING_IMAGES':
				return { ...state, images: state.images.concat(action.images) }
			case 'FETCHING_IMAGES':
				return { ...state, fetching: action.fetching }
			default:
				return state;
		}
	}
	const [imageData, imageDispatch] = useReducer(imageReducer, { images: [], fetching: true, })

	useEffect(() => {
		imageDispatch({ type: 'FETCHING_IMAGES', fetching: true })

		axios.get(`https://api.unsplash.com/photos?page=1&client_id=${unsplashToken.accessKey}`)
			.then(function (response) {
				// handle success
				imageDispatch({ type: 'PUSHING_IMAGES', images: response.data })
				imageDispatch({ type: 'FETCHING_IMAGES', fetching: false })
			})
			.catch(e => {
				// handle error
				imageDispatch({ type: 'FETCHING_IMAGES', fetching: false })
				return e
			})
	}, []);

	return (
		<Container className="App">
			<Row>
				{
					imageData.images ? imageData.images.map((image, index) => {
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
			{imageData.fetching && (
				<div className="text-center bg-secondary m-auto p-3">
					<p className="m-0 text-white">Loading More Images</p>
				</div>
			)}
			<div id='bottom-for-scrollchecking'></div>
		</Container>
	);
}

export default App;