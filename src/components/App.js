import React, { useState, useEffect, useReducer, useRef, useCallback, } from 'react';
import { Container, Row, Col, } from "reactstrap"
import axios from "axios"
import Lightbox from './Lightbox';
import unsplashToken from "../utilities/unsplashToken"
import { ImageProvider } from "../utilities/imageContext"

function App() {

	/****************************************************************/
	/*                                                              */
	/*   Initial State of Image Array and Pagination via Reducers   */
	/*                                                              */
	/****************************************************************/

	const imageReducer = (state, action) => {
		switch (action.type) {
			case 'PUSHING_IMAGES':
				return { ...state, images: [...state.images, ...action.images] }
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

	/**************************/
	/*                        */
	/* Axios Call To Call API */
	/*                        */
	/**************************/

	useEffect(() => {
		// set the dispatch type tp fetching true and only set back if done or failed
		imageDispatch({ type: 'FETCHING_IMAGES', fetching: true })
		// using template literals to expedite axios string (no need for headers object)
		axios.get(`https://api.unsplash.com/photos?page=${pagination.page}&client_id=${unsplashToken.accessKey}`)
			.then(function (response) {
				// handle success
				imageDispatch({ type: 'PUSHING_IMAGES', images: response.data })
				imageDispatch({ type: 'FETCHING_IMAGES', fetching: false })
			})
			.catch(e => {
				// handle error by terminating fetch via and exiting the useEffect
				imageDispatch({ type: 'FETCHING_IMAGES', fetching: false })
				return e
			})
	}, [imageDispatch, pagination.page]);
	// /\ /\ /\ including all items in the scope of the useEffect instead of an empty array

	/**************************/
	/*                        */
	/*  Infinite Scroll Logic */
	/*                        */
	/**************************/

	// using Intersection Observer to tell if we are at the bottom of the page
	const scrollObserver = useCallback(
		node => {
			new IntersectionObserver(entries => {
				entries.forEach(en => {
					// checking as soon as the last item comes into frame, no waiting
					if (en.intersectionRatio > 0) {
						paginationDispatch({ type: 'UPDATE_PAGE' });
						// if we are at the bottom, time to load more images via the axios call in the useEffect, 
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
			// if the react ref is within the viewport run the scrollObserver callback
		}
	}, [scrollObserver, bottomBoundaryRef]);

	/**************************/
	/*                        */
	/*   Lazy Loading Logic   */
	/*                        */
	/**************************/

	const imagesRef = useRef(null);
	// show placeholder while image is still loading. actual image source is stored in data set on html element
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

	// checking to see if the image has loaded yet, if so, update src to be actual image link, for lazy loading
	useEffect(() => {
		imagesRef.current = document.querySelectorAll('.img-fluid');
		if (imagesRef.current) {
			imagesRef.current.forEach(image => imageObserver(image));
		}
	}, [imageObserver, imagesRef, imageData.images]);

	/**************************/
	/*                        */
	/*     Lightbox Logic     */
	/*                        */
	/**************************/

	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	// toggle to open Lightbox
	const lightboxToggle = (index) => {
		// setting index to show image based on click via reducer initialization
		currentIndexDispatch({ type: 'RESET', payload: index })
		toggle()
	}

	function indexReducerInitializer(initialIndex) {
		return { index: initialIndex };
	}
	//helper method for negative modulo
	const mod = (n, m) => {
		return ((n % m) + m) % m;
	}
	// reducer to assist lightbox move forward or backward via button click through gallery
	const indexReducer = (state, action) => {
		switch (action.type) {
			case 'INCREMENT':
				return { index: mod(state.index + 1, imageData.images.length) };
			case 'DECREMENT':
				return { index: mod(state.index - 1, imageData.images.length) };
			case 'RESET':
				return indexReducerInitializer(action.payload);
			default:
				throw new Error();
		}
	}
	// initialization to -1, an index value that does not exist in the array, to assist with bug finding
	const [currentIndex, currentIndexDispatch] = useReducer(indexReducer, -1, indexReducerInitializer);

	return (
		<Container className="App">
			<ImageProvider value={{ imageData, currentIndex, currentIndexDispatch, isOpen, toggle }}>
				<Lightbox />
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
					<Row className="text-center m-auto p-3">
						<Col className="text-white">Loading More Images</Col>
					</Row>
				) : null}
				{/* hidden bottom bound box to make infinite scroll work */}
				<div ref={bottomBoundaryRef}></div>
			</ImageProvider>
		</Container>
	);
}

export default App;