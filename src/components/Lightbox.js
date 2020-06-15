import React, { useState, useContext, useReducer } from 'react'
import ImageContext from "../utilities/imageContext"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CarouselControl } from 'reactstrap';
import "./Lightbox.css"

function Lightbox() {
	const appContext = useContext(ImageContext)
	console.log(appContext)

	const specificImage = appContext.imageData.images[appContext.currentIndex.index]

	console.log(specificImage)


	return (
		<div>
			<Modal isOpen={appContext.isOpen} toggle={appContext.toggle} >
				<ModalHeader toggle={appContext.toggle}>{specificImage ? specificImage.description : null}</ModalHeader>
				<ModalBody className="d-flex flex-row">
					<CarouselControl direction="prev" directionText="Previous" onClickHandler={() => appContext.currentIndexDispatch({ type: 'DECREMENT' })} />
					{specificImage ?
						<img className="img-fluid" src={specificImage.urls.regular} alt={specificImage.alt_description} /> :
						<img src="placeholder.png" />
					}
					<CarouselControl direction="next" directionText="Next" onClickHandler={() => appContext.currentIndexDispatch({ type: 'INCREMENT' })} />
				</ModalBody>
				<ModalBody>
					<p>
						{specificImage ? specificImage.alt_description : null}
					</p>
					<p>
						Photo Taken by: {specificImage ? specificImage.user.first_name : "loading"}
					</p>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={appContext.toggle}>Close</Button>
				</ModalFooter>
			</Modal>
		</div >
	);
}




export default Lightbox;