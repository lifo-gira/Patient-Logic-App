// Progresstimeline.js
import React, { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const Progresstimeline = ({ onStepClick, onExercise }) => {
  const [activeStep, setActiveStep] = useState(-1);
  const [expandedStep, setExpandedStep] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const exercise = [
    "Running",
    "Squats",
    "PushUps",
    "PullUps",
    "Leg Hip Rotation",
  ];
  const demoexercise=[
    "https://lottie.host/8cbfc4f4-2576-4800-ab68-fbb557b7b648/qiEFjh3zMb.json",
    "https://lottie.host/b460d1ac-22ad-4021-8449-e71e8299074d/GLEetlLXRN.json",
    "https://lottie.host/83052e28-21d2-4efd-81b8-e3d7a52428bc/N3tSnWrJCJ.json",
    "https://lottie.host/559e8925-5b7f-49e4-b68d-7c79bc61d51e/PWvvXVkYzy.json",
    "https://lottie.host/481dc7e1-c7b1-4024-baff-723faded783b/0awaOV9aBa.json",
  ]

  const categories = [
    {
      "name": "Endurance",
      "exercises": [
        {
          "name": "Running",
        },
        {
          "name": "Cycling",
        },
        {
          "name": "Swimming",
        }
      ]
    },
    {
      "name": "Strength",
      "exercises": [
        {
          "name": "Weightlifting",
        },
        {
          "name": "Push-ups",
        },
        {
          "name": "Pull-ups"
        }
      ]
    },
    {
      "name": "Flexibility",
      "exercises": [
        {
          "name": "Yoga",
        },
        {
          "name": "Stretching",
        }
      ]
    },
    {
      "name": "Balance",
      "exercises": [
        {
          "name": "Single-leg stance",
        },
        {
          "name": "Balance board",
        }
      ]
    }
  ];

  const selectedExercises = [].concat(...categories
    .filter(category => onExercise.includes(category.name))
    .map(category => category.exercises.map(exercise => exercise.name))
  );
  



  const handleStepClick = (step) => {
    if (expandedStep === step) {
      setExpandedStep(null);
    } else {
      setExpandedStep(step);
    }
  
    setActiveStep(step);
  
    // Find exercises for the selected categories
    const selectedExercises = [];
    onExercise.forEach(selectedCategory => {
      const category = categories.find(category => category.name === selectedCategory);
      if (category) {
        category.exercises.forEach(exercise => {
          selectedExercises.push(exercise.name);
        });
      }
    });
  
    // Call the callback function with the selected exercise
    if (onStepClick) {
      const selectedExercise = selectedExercises[step]; // Select the exercise at the clicked step
      if (selectedExercise) {
        onStepClick(selectedExercise);
      }
    }
  };
  


  const calculateLinePercentage = (step) => {
    return (step / (exercise.length - 1)) * 100;
  };

  return (
    <div className="flex items-center flex-wrap mt-6 w-full px-12">
  {selectedExercises.map((category, step) => (
    <React.Fragment key={step}>
      {step > 0 && (
        <div className="flex-1 h-[3.5px] bg-gray-300">
          <div
            className={`h-full bg-black transition-all rounded-full ${
              activeStep > step - 1 ? "bg-green-500" : "bg-red-300"
            }`}
            style={{ width: "100%", transitionDuration: "0.3s" }}
          />
        </div>
      )}
      <div key={step} className="relative group">
        <div
          onClick={() => handleStepClick(step)}
          className={`w-12 h-6 flex items-center justify-center rounded-full border-2 cursor-pointer font-poppins ${"transform transition-all bg-black ring-0 ring-gray-600 hover:ring-[6px] group-focus:ring-4 ring-opacity-20 duration-200 shadow-md"}  ${
            expandedStep === step ? "bg-yellow-500 border-yellow-500" : ""
          } ${
            activeStep > step - 1
              ? "border-green-500 bg-green-500 text-black font-bold"
              : "border-red-500 bg-red-500"
          } `}
          style={{
            width: expandedStep === step ? "180px" : "40px",
            height: expandedStep === step ? "40px" : "40px",
            margin: "1px", // Added some spacing
            fontSize: expandedStep === step ? "14px" : "10px",
          }}
        >
          {expandedStep === step ?category:step+1}
        </div>
      </div>
    </React.Fragment>
  ))}
</div>

  );
};

export default Progresstimeline;
