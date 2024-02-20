import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const Categories = ({ onNextClick, onPrevClick , onDataSubmit}) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setScreenWidth(window.innerWidth);
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

  const handleCategoryChange = (categoryId) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedCategories);
  };

  const onEndClick = () => {
    // Store or process the selected categories, you can replace this line
    // console.log("Selected Categories:", selectedCategories);

    // Send data to the parent component using the onDataSubmit callback
    onDataSubmit(selectedCategories);
  };

  return (
    <Card className={`w-full  p-0 flex-col h-full`}>
      <CardBody
        className={`flex flex-row w-full ${screenWidth < 300 ? "p-2" : "p-5"} `}
      >
        <div
          className={`w-full ${
            screenWidth < 390 ? " flex flex-col mx-auto justify-center" : ""
          }`}
        >
          <Typography
            variant="h4"
            color="blue-gray"
            className={`py-2  text-start ${
              screenWidth < 620 ? "w-full mx-auto" : "px-8"
            }`}
          >
            Excercise Categories
          </Typography>

          <List
            className={`flex-row  gap-4 my-1  ${
              screenWidth < 390 ? "flex-col px-2 w-3/4" : " px-6 w-full"
            }`}
          >
            <ListItem className="p-0">
              <label
                htmlFor="horizontal-list-react"
                className="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Checkbox
                    id="Endurance"
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                    color="teal"
                    onChange={() => handleCategoryChange("Endurance")}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="font-medium">
                  Endurance
                </Typography>
              </label>
            </ListItem>
            <ListItem className="p-0">
              <label
                htmlFor="horizontal-list-vue"
                className="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Checkbox
                    id="Strength"
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                    color="teal"
                    onChange={() => handleCategoryChange("Strength")}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="font-medium">
                  Strength
                </Typography>
              </label>
            </ListItem>
          </List>
          <List
            className={`flex-row px-6 gap-4 my-1 w-full ${
              screenWidth < 390 ? "flex-col px-2" : "px-6"
            }`}
          >
            <ListItem className="p-0">
              <label
                htmlFor="horizontal-list-react"
                className="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Checkbox
                    id="Flexibility"
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                    color="teal"
                    onChange={() => handleCategoryChange("Flexibility")}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="font-medium">
                  Flexibility
                </Typography>
              </label>
            </ListItem>
            <ListItem className="p-0">
              <label
                htmlFor="horizontal-list-vue"
                className="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Checkbox
                    id="Balance"
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                    color="teal"
                    onChange={() => handleCategoryChange("Balance")}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="font-medium">
                  Balance
                </Typography>
              </label>
            </ListItem>
          </List>
        </div>
        <div className="w-1/2"></div>
      </CardBody>
      <div className="flex flex-row py-4">
        <a className="mx-auto my-auto">
          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={onPrevClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
            Previous
          </Button>
        </a>
        <a className="mx-auto my-auto">
          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={onEndClick}
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Button>
        </a>
      </div>
    </Card>
  );
};

export default Categories;
