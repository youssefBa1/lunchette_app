import { IonIcon } from "@ionic/react";
import { useState } from "react";
import { menuOutline, personOutline, helpCircleOutline } from "ionicons/icons";
import SideBar from "./SideBar";
const NavBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <>
      <header className="w-screen h-20 shadow-md flex items-center space-x-4 fixed top-0 left-0 bg-white z-50 ">
        <div className="h-full  flex items-center w-96 hover:bg-gray-100 duration-200  ">
          <IonIcon
            onClick={handleToggle}
            icon={menuOutline}
            style={{ fontSize: "40px", color: "black" }}
          />
          <p className="text-3xl font-medium mb-1 font-mono ml-6">Home</p>
        </div>
        <div className=" flex-grow flex justify-center items-center text-3xl  font-bold text-rose-300  ">
          <p>Lunchette</p>
        </div>
        <div className="flex-1 justify-end flex items-center  space-x-8 ">
          <IonIcon
            icon={personOutline}
            style={{ fontSize: "30px", color: "black" }}
          ></IonIcon>
          <IonIcon
            className="p-5"
            icon={helpCircleOutline}
            style={{ fontSize: "30px", color: "black" }}
          ></IonIcon>
        </div>
      </header>
      <SideBar isCollapsed={isCollapsed}></SideBar>
    </>
  );
};
export default NavBar;
