import React, { useState, useEffect } from "react";

import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  Card,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { Intro } from "./Intro";
import Patientdetails from "./Patientdetails";
import Healthcheckup from "./Healthcheckup";
import Reports from "./Reports";
import Categories from "./Categories";
import { useNavigate } from "react-router-dom";
import ChatbotComponent from "./ChatbotComponent";

const Profilebar = ({chatbot,chatcont1,chatcont2,dischat}) => {
  var storedData = localStorage.getItem("user");

  // Parse the stored data from JSON
  var parsedData = JSON.parse(storedData);
  console.log(parsedData);
  // Access the user_id property
  var userId = parsedData.user_id;
  var patient_id = parsedData._id;

  // Now, userId contains the value of the user_id property

  const profileMenuItems = [
    {
      label: userId,
      icon: UserCircleIcon,
    },
  ];

  const [profileData, setProfileData] = useState({
    patientDetails: null,
    healthCheckup: null,
    reports: null,
    categories: null,
  });

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileClickable, setIsProfileClickable] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenheight, setScreenHeight] = useState(window.innerHeight);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [patientDetailsData, setPatientDetailsData] = useState(null);
  const [healthCheckupData, setHealthCheckupData] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);
  const openDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const closeMenu = () => setIsMenuOpen(false);

  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  const menuItems = [
    "Introduction",
    "Patient Details",
    "Health Checkup",
    "Reports",
    "Categories",
  ];
  const [activeMenuItem, setActiveMenuItem] = useState(menuItems[0]);
  const [visitedComponents, setVisitedComponents] = useState([]);
  const [flag, setflag] = useState(false);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleProfileClick = () => {
    if (!isProfileClickable) {
      return;
    }
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const widnowheight = window.innerHeight;
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
      // Set isProfileClickable based on the window width
      setIsProfileClickable(windowWidth < 570); // You can adjust the threshold as needed
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

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    if(menuItem === 'Health Checkup'){
      chatbot();
      chatcont1();
    }
    else if(menuItem === 'Reports'){
      chatbot();
      chatcont2();
    }else{
      dischat();
    }
  };
  // You can perform additional actions if needed

  const getNextMenuItem = () => {
    const currentIndex = menuItems.indexOf(activeMenuItem);
    const nextIndex = (currentIndex + 1) % menuItems.length;
    return menuItems[nextIndex];
  };

  const handleNextClick = () => {
    const nextMenuItem = getNextMenuItem();
    handleMenuItemClick(nextMenuItem);
    setVisitedComponents([...visitedComponents, activeMenuItem]);
  };

  const handlePrevClick = () => {
    const prevComponent = visitedComponents.pop();
    if (prevComponent) {
      handleMenuItemClick(prevComponent);
    }
  };

  const handleflag = (menuItem) => {
    setflag(false);
    handleMenuItemClick(menuItem);
  };

  const handlePatientDetails = (data) => {
    setProfileData((prevData) => ({ ...prevData, patientDetails: data }));
  };

  // Callback function to update healthCheckup in the profileData state
  // Callback function to update healthCheckup in the profileData state
  const handleHealthCheckup = (data) => {
    setHealthCheckupData(data); // Store health checkup data locally if needed

    // Extract height, weight, and BMI from the received data
    const { Height, Weight, BMI, ...healthCheckup } = data;

    // Update profileData state with health checkup details including height, weight, and BMI
    setProfileData((prevData) => ({
      ...prevData,
      healthCheckup: {
        ...healthCheckup,
        Height: Height,
        Weight: Weight,
        BMI: BMI,
      },
    }));
  };
  console.log(profileData);
  // Callback function to update reports in the profileData state
  const handleReports = (data) => {
    setProfileData((prevData) => ({ ...prevData, reports: data }));
  };

  // Callback function to update categories in the profileData state
  const handleCategories = (data) => {
    setProfileData((prevData) => ({ ...prevData, categories: data }));
  };

  // console.log("Combined Data:", profileData);

  const navigate = useNavigate();
  useEffect(() => {
    const isDataReady = Object.values(profileData).every(
      (data) => data !== null
    );
    console.log(isDataReady)
    if (isDataReady) {
      sendDataToFastAPI();
      // Navigate to "/diagnostics" when all data is ready
      navigate("/diagnostics");
    }
  }, [profileData, navigate]);

  const sendDataToFastAPI = async () => {
    console.log(profileData.healthCheckup.bmi, "height");
    try {
      const response = await fetch("https://api-backup-vap2.onrender.com/patient-info/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          patient_id: patient_id,
          doctor_id: "",
          profession: "",
          PersonalDetails: {
            categories: profileData.categories,
            healthcheckup:{ selectedDate: profileData.healthCheckup.selectedDate},
            PatientDetails: profileData.patientDetails,
            Reports: profileData.reports,
            Height: profileData.healthCheckup.height, // Assuming height is stored in healthCheckup
            Weight: profileData.healthCheckup.weight, // Assuming weight is stored in healthCheckup
            BMI: profileData.healthCheckup.bmi,
            Age: 22,
          },
          Exercises: {
            data : []
          },
          exercises_given: {
            data: []
          },
          health_tracker: {
            exercise_tracker: true,
            meeting_link: "https://example.com/meeting",
            schedule_start_date: "2024-02-10",
            schedule_end_date: "2024-03-10",
          },
          PDF: "path/to/patient_file.pdf",
          doctor_assigned: "DoctorName",
          flag: -2,
        }),
      });

      // Handle response here if needed
      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        console.error("Failed to send data to FastAPI");
      }
    } catch (error) {
      console.error("Error during data submission:", error);
    }
  };

  // const sendDataToFastAPI = async () => {
  //   try {
  //     const response = await fetch("https://api-backup-vap2.onrender.com/patient-info/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         user_id: userId,
  //         PersonalDetails: {
  //           categories: profileData.categories,
  //           healthcheckup: profileData.healthCheckup,
  //           PatientDetails: profileData.patientDetails,
  //           Reports: profileData.reports,
  //           Height: 0,
  //           Weight: 0,
  //           BMI: 0,
  //           Age: 22,
  //         },
  //         Exercises: {
  //           Running: [], // Empty array for Running
  //           Squats: [], // Empty array for Squats
  //           Pushups: [], // Empty array for Pushups
  //           Pullups: [], // Empty array for Pullups
  //           LegHipRotation: [], // Empty array for LegHipRotation
  //         },
  //         PDF: "", // Empty string for PDF
  //         doctor_assigned: "", // Empty string for doctor_assigned
  //         flag: -1,
  //       }),
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log(result);
  //     } else {
  //       console.error("Failed to send data to FastAPI");
  //     }
  //   } catch (error) {
  //     console.error("Error during data submission:", error);
  //   }
  // };

  return (
    <div className="">
      <Navbar
        variant="gradient"
        color="blue-gray"
        className="max-w-full from-gray-800 to-gray-600 rounded-b-3xl rounded-t-none  py-2"
      >
        {!isProfileClickable && (
          <div className="flex  items-center justify-between  text-white">
            <div className="relative flex w-full md:w-max items-center">
              <button class="relative group rounded-full">
                {screenWidth < 1350 && (
                  <div
                    className={`relative flex items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 focus:ring-4 ring-opacity-30 duration-200 shadow-md ${
                      isClicked ? "rotate-[45deg]" : ""
                    }`}
                    onClick={() => {
                      handleClick();
                      openDrawer();
                    }}
                  >
                    <div class="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 ">
                      <div
                        className={`bg-white h-[2px] w-1/2 rounded ${
                          isClicked
                            ? "rotate-90 h-[1px] origin-right delay-75 translate-y-[1px]"
                            : ""
                        }`}
                      ></div>
                      <div class="bg-white h-[1px] rounded"></div>
                      <div
                        className={`bg-white h-[2px] w-1/2 rounded self-end ${
                          isClicked
                            ? "rotate-90 h-[1px] origin-left delay-75 translate-y-[1px]"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </button>
              <Typography
                as="a"
                href="#"
                variant="h6"
                className="mr-4 ml-2 cursor-pointer py-1.5"
              >
                WAD
              </Typography>
            </div>

            <div className="relative flex w-full justify-end items-center gap-2 md:w-max">
              {!isProfileClickable && <p>{userId}</p>}
              <Menu
                open={isMenuOpen}
                handler={setIsMenuOpen}
                placement="bottom-end"
              >
                <MenuHandler>
                  <Button
                    variant="text"
                    color="blue-gray"
                    className={`flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto ${
                      !isProfileClickable ? "cursor-not-allowed" : ""
                    }`}
                    onClick={handleProfileClick}
                  >
                    <Avatar
                      variant="circular"
                      size="sm"
                      alt="tania andrew"
                      className="border-[3px] border-white-900"
                      src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                    />
                  </Button>
                </MenuHandler>
                {isProfileClickable && (
                  <MenuList className="p-1">
                    {profileMenuItems.map(({ label, icon }, key) => {
                      const isLastItem = key === profileMenuItems.length - 1;
                      return (
                        <MenuItem
                          key={label}
                          onClick={closeMenu}
                          className={`flex items-center gap-2 rounded ${
                            isLastItem
                              ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                              : ""
                          }`}
                        >
                          {React.createElement(icon, {
                            className: `h-4 w-4 ${
                              isLastItem ? "text-red-500" : ""
                            }`,
                            strokeWidth: 2,
                          })}
                          <Typography
                            as="span"
                            variant="small"
                            className="font-normal"
                            color={isLastItem ? "red" : "inherit"}
                          >
                            {label}
                          </Typography>
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                )}
              </Menu>
            </div>
          </div>
        )}

        {isProfileClickable && (
          <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
            <div className="relative flex w-full md:w-max items-center">
              <button class="relative group rounded-full">
                <div
                  className={`relative flex items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 focus:ring-4 ring-opacity-30 duration-200 shadow-md ${
                    isClicked ? "rotate-[45deg]" : ""
                  }`}
                  onClick={() => {
                    handleClick();
                    openDrawer();
                  }}
                >
                  <div class="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 ">
                    <div
                      className={`bg-white h-[2px] w-1/2 rounded ${
                        isClicked
                          ? "rotate-90 h-[1px] origin-right delay-75 translate-y-[1px]"
                          : ""
                      }`}
                    ></div>
                    <div class="bg-white h-[1px] rounded"></div>
                    <div
                      className={`bg-white h-[2px] w-1/2 rounded self-end ${
                        isClicked
                          ? "rotate-90 h-[1px] origin-left delay-75 translate-y-[1px]"
                          : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </button>
              <Typography
                as="a"
                href="#"
                variant="h6"
                className="mr-4 ml-2 cursor-pointer py-1.5"
              >
                WAD
              </Typography>
              <div className="ml-auto">
                <div className="relative flex w-full gap-4 md:w-max">
                  <div>
                    {!isProfileClickable && <p>{userId}</p>}
                    <Menu
                      open={isMenuOpen}
                      handler={setIsMenuOpen}
                      placement="bottom-end"
                    >
                      <MenuHandler>
                        <Button
                          variant="text"
                          color="blue-gray"
                          className={`flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto ${
                            !isProfileClickable ? "cursor-not-allowed" : ""
                          }`}
                          onClick={handleProfileClick}
                        >
                          <Avatar
                            variant="circular"
                            size="sm"
                            alt="tania andrew"
                            className="border-[3px] border-white-900"
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                          />
                        </Button>
                      </MenuHandler>
                      {isProfileClickable && (
                        <MenuList className="p-1">
                          {profileMenuItems.map(({ label, icon }, key) => {
                            const isLastItem =
                              key === profileMenuItems.length - 1;
                            return (
                              <MenuItem
                                key={label}
                                onClick={closeMenu}
                                className={`flex items-center gap-2 rounded ${
                                  isLastItem
                                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                                    : ""
                                }`}
                              >
                                {React.createElement(icon, {
                                  className: `h-4 w-4 ${
                                    isLastItem ? "text-red-500" : ""
                                  }`,
                                  strokeWidth: 2,
                                })}
                                <Typography
                                  as="span"
                                  variant="small"
                                  className="font-normal"
                                  color={isLastItem ? "red" : "inherit"}
                                >
                                  {label}
                                </Typography>
                              </MenuItem>
                            );
                          })}
                        </MenuList>
                      )}
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Drawer
          open={screenWidth >= 1350 ? "true" : isDrawerOpen}
          overlay={false}
          className={`
            ${screenheight > 670 ? "mt-24" : "mt-20"}`}
        >
          <Card
            color="transparent"
            shadow={false}
            className={`h-[calc(100vh-2rem)] w-full   ${
              screenheight < 670 ? "h-[30rem] pl-8 pr-8" : "py-8 ml-auto"
            }`}
          >
            <List className={`pl-16 rounded-none pr-0`}>
              <ListItem
                className={`font-base text-xl rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  activeMenuItem === "Introduction"
                    ? "bg-gradient-to-r from-white to-cyan-200"
                    : ""
                }`}
                onClick={() => handleflag("Introduction")}
              >
                Introduction
              </ListItem>
              <ListItem
                className={`font-base text-xl rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  activeMenuItem === "Patient Details"
                    ? "bg-gradient-to-r from-white to-cyan-200"
                    : ""
                }`}
                onClick={() => handleflag("Patient Details")}
              >
                Patient Details
              </ListItem>
              <ListItem
                className={`font-base text-xl rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  activeMenuItem === "Health Checkup"
                    ? "bg-gradient-to-r from-white to-cyan-200"
                    : ""
                }`}
                onClick={() => handleflag("Health Checkup")}
              >
                Health Checkup
              </ListItem>
              <ListItem
                className={`font-base text-xl rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  activeMenuItem === "Reports"
                    ? "bg-gradient-to-r from-white to-cyan-200"
                    : ""
                }`}
                onClick={() => handleflag("Reports")}
              >
                Reports
              </ListItem>
              <ListItem
                className={`font-base text-xl rounded-none focus:bg-gradient-to-r from-white to-cyan-200 ${
                  activeMenuItem === "Categories"
                    ? "bg-gradient-to-r from-white to-cyan-200"
                    : ""
                }`}
                onClick={() => handleflag("Categories")}
              >
                Categories
              </ListItem>
              <ListItem className="font-base text-xl rounded-none ">
                Output
              </ListItem>
              <hr
                className={` border-blue-gray-50 ${
                  screenheight < 670 ? "my-2" : "my-14"
                }`}
              />
              <ListItem className="font-base text-xl rounded-none ">
                <ListItemPrefix>
                  <Cog6ToothIcon className="h-5 w-5" />
                </ListItemPrefix>
                Setting
              </ListItem>
              <ListItem className="font-base text-xl rounded-none ">
                <ListItemPrefix>
                  <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>
                Log Out
              </ListItem>
            </List>
          </Card>
        </Drawer>
      </Navbar>
      <div
        className={`  ${
          (screenWidth === 1024 && screenheight === 600 && (activeMenuItem === "Health Checkup" || activeMenuItem === "Reports"))?"mx-auto px-4 w-5/6 h-full mt-8 flex justify-center": 
       screenWidth >= 1350
         ? "ml-auto  pr-28 w-3/4 h-full mt-10"
         : screenWidth < 1350 && activeMenuItem
         ? "mx-auto px-4 w-5/6 h-full mt-8 flex justify-center"
         : screenWidth > 1139 && screenWidth < 1660
         ? "pr-10 w-2/3 h-full mt-12"
         : screenWidth < 430
         ? "px-4 w-full h-full mt-8"
         : "px-8 w-full h-full mt-8 ml-auto"
     }`}
      >
        {activeMenuItem === "Introduction" && (
          <Intro onNextClick={!isClicked ? handleNextClick : null} />
        )}
        {activeMenuItem === "Patient Details" && (
          <Patientdetails
            onNextClick={!isClicked ? handleNextClick : null}
            onPrevClick={!isClicked ? handlePrevClick : null}
            onflag={!isClicked ? true : false}
            onDataSubmit={handlePatientDetails}
          />
        )}
        {activeMenuItem === "Health Checkup" && (
          <Healthcheckup
            onNextClick={!isClicked ? handleNextClick : null}
            onPrevClick={!isClicked ? handlePrevClick : null}
            onDataSubmit={handleHealthCheckup}
          />
        )}
        {activeMenuItem === "Reports" && (
          <Reports
            onNextClick={!isClicked ? handleNextClick : null}
            onPrevClick={!isClicked ? handlePrevClick : null}
            onDataSubmit={handleReports}
          />
        )}
        {activeMenuItem === "Categories" && (
          <Categories
            onPrevClick={!isClicked ? handlePrevClick : null}
            onDataSubmit={handleCategories}
          />
        )}
      </div>
      {/* <ChatbotComponent /> */}
    </div>
  );
};

export default Profilebar;
