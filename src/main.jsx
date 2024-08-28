import React from "react";
import ReactDOM from "react-dom/client";
import App from "/src/App.jsx";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/effect-fade";
import "react-loading-skeleton/dist/skeleton.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-toastify/dist/ReactToastify.css";
import "/src/styles/Main.css";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
