import React, { useState, useEffect } from "react";
import Loading from "../assets/loading.json"
import Lottie from 'react-lottie-player'
import Typewriter from 'typewriter-effect';
import Loaded from '../assets/Loading.mp4';

const Flashscreen = () => {

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenheight, setScreenHeight] = useState(window.innerHeight);
  const [isside, setisside] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
      setisside(windowWidth < 1535);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`w-full h-screen `}>
        {/* <Lottie
      loop
      animationData={Loading}
      play
      className={`w-full h-3/4 p-0`}
    />

    <Typewriter
        onInit={(typewriter) => {
          typewriter.typeString('Generating your report...')
            .callFunction(() => {
              console.log('String typed out!');
            })
            .pauseFor(100)
            .deleteAll()
            .callFunction(() => {
              console.log('All strings were deleted');
            })
            .start();
        }}
        className={`w-full h-1/6 text-3xl text-center font-bold text-green-500`}
        // Add Tailwind CSS classes here for styling
        options={{
          wrapperClassName: screenWidth<470?'text-5xl font-semibold w-3/4 text-green-800':'text-7xl font-semibold text-green-800',
          loop: true,
          deleteSpeed: 50 // Additional class for the wrapper element
        }}
      /> */}
      
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          // controls
          autoPlay
          loop
          // poster="/videos/poster-image.jpg"
        >
          <source src={Loaded} type="video/mp4" />
          {/* Your browser does not support the video tag. */}
        </video>
      </div>
    </div>
  )
}

export default Flashscreen