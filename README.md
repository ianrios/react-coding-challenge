# React Developer Coding Challenge

## Additional Install Requirements

This solution included the use of three packages from NPM. 

- Bootstrap
- reactstrap
- Axios
  
To install and confirm the project runs as expected be sure to run `npm install` before running `npm build`

This is a coding challenge for prospective front-end and full-stack developer applicants applying to DemandHub. If you're unfamiliar with React, Facebook has put together a helpful tutorial that provides a quick introduction to the basics: https://reactjs.org/docs/hello-world.html

## Goal:

#### Build a simple React app that allows viewing and interacting with a grid of curated photos from Unsplash

- [x] Fork this repo into your GitHub account. Keep it public until we have been able to review it.
- [x] Use `create-react-app` to set up a basic single-page React application as shown here: https://reactjs.org/docs/create-a-new-react-app.html#create-react-app. (NOTE: We will only focus on creating a single-page React application, so don't worry about the other sections on that page such as Next.js).
- [x] Refer to the Unsplash API docs here to set up a developer account: https://unsplash.com/documentation.
- [x] Display a grid of photos in your React app. Use the `GET /photos/curated` endpoint from the Unsplash API to get a set of curated images.
- [x] The grid of photos should preserve the aspect ratio of the photos it's displaying, meaning it shouldn't crop the image in any way.
- [x] The grid should be responsive, and should work in both portrait and landscape orientations on both mobile and desktop browsers.
- [ ] The grid should support infinite scrolling, using a lazy-load strategy to fetch additional images as the user scrolls.
- [x] When the user taps on a photo on the grid it should show the full photo in a full width lightbox popup with more information about the photo.
- [x] The lightbox popup should be dismissible with a close button.
- [ ] Add left/right arrows or swiping to the lightbox, to allow browsing the previous/next images without dismissing the popup.
- [x] You're free to use existing open source React components or Javascript packages/libraries from npm to complete this task.

### Evaluation:
- [x] The React app should build without errors (typically using `npm run build`). If there are necessary steps required to get it to compile, those should be covered in README.md.
- [ ] No crashes or bugs.
- [x] App should operate as a single-page application, without the need for a custom back-end.
- [x] Code is easily understood and communicative (eg. comments, variable names, etc).
- [x] GitHub commit history is consistent, easy to follow and understand.
