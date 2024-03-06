import React,{useState,useEffect} from "react";

import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  BellIcon,
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/solid";

const Profilebar = () => {
  const profileMenuItems = [
    {
      label: "Raj Ronald Shaw",
      icon: UserCircleIcon,
    },
  ];
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileClickable, setIsProfileClickable] = useState(true);

  const closeMenu = () => setIsMenuOpen(false);

  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

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
      // Set isProfileClickable based on the window width
      setIsProfileClickable(windowWidth < 720); // You can adjust the threshold as needed
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
    <Navbar
      variant="gradient"
      color="blue-gray"
      className="max-w-full from-blue-gray-900 to-blue-gray-800 rounded-b-3xl rounded-t-none  py-2"
    >
      {!isProfileClickable&&(
        <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
        <div className="relative flex w-full md:w-max items-center">
          {/* <button class="relative group">
            <div class="relative flex items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
              <div class="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 group-focus:-rotate-[45deg] origin-center">
                <div class="bg-white h-[2px] w-1/2 rounded transform transition-all duration-300 group-focus:-rotate-90 group-focus:h-[1px] origin-right delay-75 group-focus:-translate-y-[1px]"></div>
                <div class="bg-white h-[1px] rounded"></div>
                <div class="bg-white h-[2px] w-1/2 rounded self-end transform transition-all duration-300 group-focus:-rotate-90 group-focus:h-[1px] origin-left delay-75 group-focus:translate-y-[1px]"></div>
              </div>
            </div>
          </button> */}
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="mr-4 ml-2 cursor-pointer py-1.5"
          >
            WAD
          </Typography>
        </div>
        <div className="ml-auto mr-12 relative flex w-full gap-2 md:w-max items-center">
          <div className="ml-auto relative flex w-full gap-2 md:w-max">
            <input
              type="search"
              class="peer cursor-pointer relative z-10 h-12 w-12 rounded-full border bg-transparent pl-12 outline-none focus:w-full focus:cursor-text focus:border-white focus:pl-16 focus:pr-4"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-gray-500 px-3.5 peer-focus:border-white peer-focus:stroke-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              style={{ stroke: "white" }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="relative flex w-full gap-2 md:w-max">
            <IconButton variant="text" color="white">
              <BellIcon className="h-7 w-7" />
            </IconButton>
          </div>
        </div>
        <div className="relative flex w-full items-center gap-2 md:w-max">
          {!isProfileClickable && (<p>Raj Ronald Shaw</p>)}
          <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
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
            {isProfileClickable&&(<MenuList className="p-1">
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
                      className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
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
          {/* <button class="relative group">
            <div class="relative flex items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
              <div class="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 group-focus:-rotate-[45deg] origin-center">
                <div class="bg-white h-[2px] w-1/2 rounded transform transition-all duration-300 group-focus:-rotate-90 group-focus:h-[1px] origin-right delay-75 group-focus:-translate-y-[1px]"></div>
                <div class="bg-white h-[1px] rounded"></div>
                <div class="bg-white h-[2px] w-1/2 rounded self-end transform transition-all duration-300 group-focus:-rotate-90 group-focus:h-[1px] origin-left delay-75 group-focus:translate-y-[1px]"></div>
              </div>
            </div>
          </button> */}
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
            <IconButton variant="text" color="white">
              <BellIcon className="h-7 w-7" />
            </IconButton>
            <div >
          {!isProfileClickable && (<p>Raj Ronald Shaw</p>)}
          <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
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
            {isProfileClickable&&(<MenuList className="p-1">
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
                      className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
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
        <div className="mx-auto relative flex w-full gap-2 md:w-max">
          <div className="mx-auto relative flex md:w-max">
            <input
              type="search"
              class="peer cursor-pointer relative z-10 h-12 w-12 rounded-full border bg-transparent pl-12 outline-none focus:w-full focus:cursor-text focus:border-white focus:pl-16 focus:pr-4"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-gray-500 px-3.5 peer-focus:border-white peer-focus:stroke-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              style={{ stroke: "white" }}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      )}
    </Navbar>
  );
};

export default Profilebar;
