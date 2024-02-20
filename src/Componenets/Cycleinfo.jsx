import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

const CycleInfo = () => {
  const pain=[20,5,4,8,10,8,8,12]
    const data = [
        [
          { key: "Minimum Angle", value: "120" },
          { key: "Maximum Angle", value: "120" },
          { key: "Flexion Angle", value: "120" },
          { key: "Extension Angle", value: "120" },
          { key: "Velocity", value: "120" },
          { key: "ROM", value: "120" },
        ],
        [
          { key: "Minimum Angle", value: "120" },
          { key: "Maximum Angle", value: "120" },
          { key: "Flexion Angle", value: "120" },
          { key: "Extension Angle", value: "120" },
          { key: "Velocity", value: "120" },
          { key: "ROM", value: "120" },
        ],
        [
          { key: "Minimum Angle", value: "120" },
          { key: "Maximum Angle", value: "120" },
          { key: "Flexion Angle", value: "120" },
          { key: "Extension Angle", value: "120" },
          { key: "Velocity", value: "120" },
          { key: "ROM", value: "120" },
        ],
        [
          { key: "Minimum Angle", value: "120" },
          { key: "Maximum Angle", value: "120" },
          { key: "Flexion Angle", value: "120" },
          { key: "Extension Angle", value: "120" },
          { key: "Velocity", value: "120" },
          { key: "ROM", value: "120" },
        ],
        [
          { key: "Minimum Angle", value: "120" },
          { key: "Maximum Angle", value: "120" },
          { key: "Flexion Angle", value: "120" },
          { key: "Extension Angle", value: "120" },
          { key: "Velocity", value: "120" },
          { key: "ROM", value: "120" },
        ],
        [
            { key: "Minimum Angle", value: "120" },
            { key: "Maximum Angle", value: "120" },
            { key: "Flexion Angle", value: "120" },
            { key: "Extension Angle", value: "120" },
            { key: "Velocity", value: "120" },
            { key: "ROM", value: "120" },
          ],
          [
            { key: "Minimum Angle", value: "120" },
            { key: "Maximum Angle", value: "120" },
            { key: "Flexion Angle", value: "120" },
            { key: "Extension Angle", value: "120" },
            { key: "Velocity", value: "120" },
            { key: "ROM", value: "120" },
          ],
          [
            { key: "Minimum Angle", value: "120" },
            { key: "Maximum Angle", value: "120" },
            { key: "Flexion Angle", value: "120" },
            { key: "Extension Angle", value: "120" },
            { key: "Velocity", value: "120" },
            { key: "ROM", value: "120" },
          ],
        
        
    ]
    
    return(
        <div className='ml-4 mr-4 relative flex items-center'>
        <div className="w-full h-full py-2 overflow-x-scroll scroll scroll-smooth whitespace-nowrap   gap-4">
        {data.map((datas, index) => (
        <Card key={index} color={pain[index]>10?'red':'green'} variant="gradient" className="w-full max-w-[15rem] p-2 ml-1  mr-2 inline-block hover:scale-105 ease-in-out duration-300" >
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 mb-1 rounded-none border-b border-white/10 pb-2 text-center"
        >
          <Typography
            variant="small"
            color="black"
            className="font-bold uppercase"
          >
            CYCLE {index+1}
          </Typography>
          <Typography
            variant="h1"
            color="black"
            className="mt-2 flex justify-center gap-1 text-4xl font-bold"
          >
            {pain[index]}{" "}
            <span className="self-end text-base">Pain</span>
          </Typography>
        </CardHeader>
        <CardBody className="pt-0 pb-2">
          <ul className="flex flex-col">
          {datas.map((val, ind) => (
            <li key={ind} className="flex items-center justify-between">
              <Typography color='black' className="text-base font-medium">{val.key}</Typography>
              <Typography color='black' className="text-base font-medium">{val.value}</Typography>
            </li>
          ))}
          </ul>
        </CardBody>
      </Card>
        ))}
      </div>
      </div>
    );
}

export default CycleInfo;
