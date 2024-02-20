import React,{useState,useEffect} from 'react'

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";

  import {ClockIcon} from "@heroicons/react/24/solid";


const Maingraphinfo = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [isrenderscreen, setIsrenderscreen] = useState(true);

    const info=[
            {key:"Mode",value:"Active"},
            {key:"Minimum Angle",value:"120"},
            {key:"Flexion Angle",value:"120"},
            {key:"Velocity",value:"120"},
            {key:"Leg",value:"Left"},
            {key:"Maximum Angle",value:"120"},
            {key:"Extension Angle",value:"120"},
            {key:"ROM",value:"120"},
    
    ]


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
     {(screenWidth >=1242 ? isrenderscreen : !isrenderscreen)&&(
    <Card color="gray" variant="gradient" className="w-full  px-6">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className=" mb-4 rounded-none border-b border-white/10 pb-1 mt-0 text-center"
      >
        <Typography
          variant="h1"
          color="white"
          className="mt-6 flex justify-center gap-1 text-7xl font-normal"
        >
          <ClockIcon className="lg:h-7 lg:w-7 md:h-5 md:w-5"/>120<p className='text-lg flex items-end'>sec</p>

        </Typography>
      </CardHeader>
      <CardBody className="p-0">
        <ul className="flex flex-col gap-3.5">
          <li className="flex justify-center items-center gap-4">
            <Typography className="font-normal text-2xl">Active</Typography>
            <Typography className="font-normal text-2xl">/</Typography>
            <Typography className="font-normal text-2xl">Left Leg</Typography>
          </li>
          <li className="flex items-center gap-4 justify-between">
          <Typography className="font-normal">Maximum Angle</Typography>
            <Typography className="font-normal">120</Typography>
          </li>
          <li className="flex items-center gap-4 justify-between">
          <Typography className="font-normal">Minimum Angle</Typography>
            <Typography className="font-normal">120</Typography>
          </li>
          <li className="flex items-center gap-4 justify-between">
          <Typography className="font-normal">Flexion Angle</Typography>
            <Typography className="font-normal">120</Typography>
          </li>
          <li className="flex items-center gap-4 justify-between">
          <Typography className="font-normal">Extension Angle</Typography>
            <Typography className="font-normal">120</Typography>
          </li>
          <li className="flex items-center gap-4 justify-between">
          <Typography className="font-normal">Velocity</Typography>
            <Typography className="font-normal">120</Typography>
          </li>
          <li className="flex items-center gap-4 justify-between">
          <Typography className="font-normal">ROM</Typography>
            <Typography className="font-normal">120</Typography>
          </li>
        </ul>
      </CardBody>
      <CardFooter className="pt-4 w-full">
        <div className='w-full flex gap-3'>
        <Typography className='font-bold'>
            Note:
        </Typography>
        <Typography>
        Angles in degrees
        </Typography>
        </div>
      </CardFooter>
    </Card>
    )}
    
    {(screenWidth <1242 ? isrenderscreen : !isrenderscreen)&&(
    <Card color="gray" variant="gradient" className="w-full px-6">
    <div className={`grid grid-rows-3 gap-2 ${screenWidth>=1205?"grid-cols-5":screenWidth<1205&&screenWidth>=845?"grid-cols-3":screenWidth<845&&screenWidth>=595?"grid-cols-2":"grid-cols-1"}`}>
      {/* Merged cell spanning 2 rows in the 1st column */}
      <div className="col-span-1 row-span-2 flex justify-center items-center">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="mx-auto rounded-none border-b border-white/10 pb-2 mt-0 text-center"
        >
          <Typography
            variant="h1"
            color="white"
            className={` flex justify-center gap-1 font-normal ${screenWidth>=845?"text-7xl":"text-6xl"}`}
          >
            <ClockIcon className={`${screenWidth>=845?"w-7 h-7":"w-6 h-6"}`} />
            120
            <p className={`flex items-end ${screenWidth>=845?"text-lg":"text-base"}`}>sec</p>
          </Typography>
        </CardHeader>
        {/* Card Body and Footer content goes here */}
      </div>
  
      {/* Columns 2 to 5 for CardBody content */}
      {info.map((data, index) => (
        <div key={index} className="col-span-1">
          {/* CardBody content */}
          <CardBody>
            <ul className="flex flex-col">
              {/* Your list items go here */}
              <li className="flex justify-between items-center w-full">
                <Typography className="font-normal text-base sm:text-lg">
                  {data.key}
                </Typography>
  
                <Typography className="font-normal text-base sm:text-lg">
                  {data.value}
                </Typography>
              </li>
              {/* Add more list items as needed */}
            </ul>
          </CardBody>
        </div>
      ))}
  
      {/* Centered CardFooter in the 3rd row */}
      <div className="col-span-1 row-span-1 flex items-center justify-center">
        <CardFooter>
          <div className="flex gap-3">
            <Typography className="font-bold text-base sm:text-lg">
              Note:
            </Typography>
            <Typography className="text-base sm:text-lg">
              Angles in degrees
            </Typography>
          </div>
        </CardFooter>
      </div>
    </div>
  </Card>
  
)}
</div>
  )
}

export default Maingraphinfo