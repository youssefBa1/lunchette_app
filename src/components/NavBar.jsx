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
      <header className="w-full h-16 md:h-20 shadow-md flex items-center justify-between fixed top-0 left-0 bg-white z-50 px-2 md:px-4">
        <div className="h-full flex items-center md:w-96 hover:bg-gray-100 duration-200">
          <IonIcon
            onClick={handleToggle}
            icon={menuOutline}
            style={{ fontSize: "30px", color: "black" }}
            className="cursor-pointer md:text-4xl"
            data-menu-toggle="true"
          />
          <p className="text-xl md:text-3xl font-medium font-mono ml-2 md:ml-6 hidden sm:block">
            Home
          </p>
        </div>

        <div className="flex justify-center items-center text-2xl md:text-3xl font-bold text-rose-300">
          <p>Lunchette</p>
        </div>

        <div className="flex items-center space-x-4 md:space-x-8">
          <IonIcon
            icon={personOutline}
            style={{ fontSize: "24px", color: "black" }}
            className="md:text-3xl"
          />
          <IonIcon
            icon={helpCircleOutline}
            style={{ fontSize: "24px", color: "black" }}
            className="md:p-5 md:text-3xl"
          />
        </div>
      </header>
      <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
    </>
  );
};

export default NavBar;
