import React, { useContext } from 'react'
import ImageContext from "../utilities/imageContext"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CarouselControl } from 'reactstrap';

function Lightbox() {
	// get the app context
	const appContext = useContext(ImageContext)
	// find the specific image via bracket notation
	const specificImage = appContext.imageData.images[appContext.currentIndex.index]

	return (
		<div>
			{/* use a reactstrap modal as the "lightbox"*/}
			<Modal isOpen={appContext.isOpen} toggle={appContext.toggle} >
				<ModalHeader toggle={appContext.toggle}>{specificImage ? specificImage.description : null}</ModalHeader>
				<ModalBody className="d-flex flex-row">
					{/* I decided to use a bootstrap Carousel button as they look exactly how I would like with minimal css */}
					<CarouselControl
						direction="prev"
						directionText="Previous"
						onClickHandler={() => appContext.currentIndexDispatch({ type: 'DECREMENT' })}
					/>
					{specificImage ?
						<img className="img-fluid" src={specificImage.urls.regular} alt={specificImage.alt_description} /> :
						<img src="placeholder.png" />
					}
					<CarouselControl
						direction="next"
						directionText="Next"
						onClickHandler={() => appContext.currentIndexDispatch({ type: 'INCREMENT' })}
					/>
				</ModalBody>
				<ModalBody>
					{/* additional details as per the instruction docs */}
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