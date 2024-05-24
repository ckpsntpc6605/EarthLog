# EarthLog

EarthLog is a website that records your travel memories. By using markers, you can see which countries you have visited and read the stories you wrote. You can also share the story to others .

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

![Logo](/public/images/demo/README_content.png)

## Index

- [About EarthLog](#about-earthlog)
- [Built with](#built-with)
- [Demo](#demo)
- [Contact Me](#contact-me)

## About EarthLog

- Utilized `Tailwind CSS` for responsive web design (RWD) and resolved the issue of CSS global scope.
- Developed as a Single Page Application (`SPA`) using React for a dynamic and efficient user interface.
- To avoid re-rendering the entire subtree and prevent props drilling issues, used `Zustand` for state management.
- Leveraged `Firebase` for backend services, including database, hosting, storage and authentication.
- Utilized `Mapbox` for interactive map creation, allowing users to place markers on the globe and clearly visualize the number of destinations visited.
- Implemented `GSAP` for smooth transition animations on the landing page.
- Implemented private routes integrated with `Firebase authentication`.
- Used debounce technique to prevent saving excessive data within a short period.

## Built with

![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)
![React-router-dom](https://img.shields.io/badge/React%20Router-CA4245.svg?style=for-the-badge&logo=React-Router&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=for-the-badge&logo=Vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=for-the-badge&logo=Tailwind-CSS&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28.svg?style=for-the-badge&logo=Firebase&logoColor=black)
![Mapbox](https://img.shields.io/badge/Mapbox-000000.svg?style=for-the-badge&logo=Mapbox&logoColor=white)

- React
- React-router-dom
- Vite
- Tailwind CSS
- Zustand
- Mapbox
- Firebase

## Demo

- Using marking tool to tag locations you've visited.
  ![Marker](/public/images/demo/Marking.gif)
- Clicking on map markers to view posts.
  ![ViewPost](/public/images/demo/CheckPost.gif)
- Clicking the destination to check the location of marker that other user posted.
  ![ViewForumPost](/public/images/demo/CheckDestination.gif)
- Viewing the public posts by clicking the marker.
  ![ViewForumPost](/public/images/demo/ForumPost.gif)

## 🔗 Contact Me

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yong-lee-b44ba9243/)
