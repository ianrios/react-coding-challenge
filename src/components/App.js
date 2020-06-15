import React, { useState, useEffect, useReducer, useRef, useCallback, } from 'react';
import { Container, Row, Col, } from "reactstrap"
import axios from "axios"
import unsplashToken from "../utilities/unsplashToken"
import Lightbox from './Lightbox';
import { ImageProvider } from "../utilities/imageContext"

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

	const pageReducer = (state, action) => {
		switch (action.type) {
			case 'UPDATE_PAGE':
				return { ...state, page: state.page + 1 }
			default:
				return state;
		}
	}
	const [pagination, paginationDispatch] = useReducer(pageReducer, { page: 0 })

	useEffect(() => {
		//set the dispatch type tp fetching true and only set back if done or failed
		imageDispatch({ type: 'FETCHING_IMAGES', fetching: true })
		axios.get(`https://api.unsplash.com/photos?page=${pagination.page}&client_id=${unsplashToken.accessKey}`)
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
	}, [imageDispatch, pagination.page]);
	// including all items in scope instead of an empty array


	//using intersection observer to tell if we are at the bottom of the page
	const scrollObserver = useCallback(
		node => {
			new IntersectionObserver(entries => {
				entries.forEach(en => {
					if (en.intersectionRatio > 0) {
						paginationDispatch({ type: 'UPDATE_PAGE' });
					}
				});
			}).observe(node);
		},
		[paginationDispatch]
	);

	let bottomBoundaryRef = useRef(null);
	useEffect(() => {
		if (bottomBoundaryRef.current) {
			scrollObserver(bottomBoundaryRef.current);
		}
	}, [scrollObserver, bottomBoundaryRef]);


	const imagesRef = useRef(null);
	// lazy loading - show placeholder while image is still loading. 
	const imageObserver = useCallback(node => {
		const intersectionObserver = new IntersectionObserver(entries => {
			entries.forEach(en => {
				if (en.intersectionRatio > 0) {
					const currentImage = en.target;
					const newImageSrc = currentImage.dataset.src;

					// swap out image src if new url exists, this should replace the conditional in the render
					if (!newImageSrc) {
						console.error('Image source is invalid');
					} else {
						currentImage.src = newImageSrc;
					}
					intersectionObserver.unobserve(node); // detach the observer when done
				}
			});
		})
		intersectionObserver.observe(node);
	}, []);

	useEffect(() => {
		imagesRef.current = document.querySelectorAll('.img-fluid');

		if (imagesRef.current) {
			imagesRef.current.forEach(image => imageObserver(image));
		}
	}, [imageObserver, imagesRef, imageData.images]);

	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);


	const [clickedImageIndex, setClickedImageIndex] = useState(0);

	const lightboxToggle = (index) => {
		console.log(index)
		setClickedImageIndex(index)
		// currentIndexDispatch({ type: 'SET_NEW_INDEX' })
		toggle()
	}

	// const initialIndex = { index: 0 }

	// const indexReducer = (state, action) => {
	// 	switch (action.type) {
	// 		case 'INCREMENT':
	// 			return { index: state.count + 1 % imageData.images.length };
	// 		case 'DECREMENT':
	// 			return { index: state.count - 1 % imageData.images.length };
	// 		case 'SET_NEW_INDEX':
	// 			return { index: clickedImageIndex };
	// 		default:
	// 			throw new Error();
	// 	}
	// }
	// const [currentIndex, currentIndexDispatch] = useReducer(indexReducer, initialIndex);

	return (
		<Container className="App">
			<ImageProvider value={{ imageData, clickedImageIndex, isOpen }}>
				<Lightbox
					toggle={toggle}
				/>
				<Row>
					{
						imageData.images.map((image, index) => {
							return (
								<Col xs="6" sm="4" md="3" lg="2" key={index} className="mb-2">
									<img
										className="img-fluid"
										alt={image.alt_description}
										data-src={image.urls.regular}
										src={'placeholder.png'}
										onClick={() => lightboxToggle(index)}
									/>
								</Col>
							)
						})
					}
				</Row>
				{imageData.fetching ? (
					<div className="text-center bg-secondary m-auto p-3">
						<p className="m-0 text-white">Loading More Images</p>
					</div>
				) : null}
				<div ref={bottomBoundaryRef}></div>
			</ImageProvider>
		</Container>
	);
}

export default App;