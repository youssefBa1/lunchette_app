import { IonIcon } from "@ionic/react";
import { useEffect, useRef } from "react";
import {
  homeOutline,
  peopleCircleOutline,
  cartOutline,
  calendarOutline,
  closeOutline,
  settingsOutline,
} from "ionicons/icons";

const SideBar = ({ isCollapsed, setIsCollapsed }) => {
  const sidebarRef = useRef(null);

  // Handle clicks outside sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCollapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("[data-menu-toggle]")
      ) {
        // Only close on mobile screens
        if (window.innerWidth < 768) {
          setIsCollapsed(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed, setIsCollapsed]);

  return (
    <div
      ref={sidebarRef}
      className={`${
        isCollapsed ? "translate-x-0" : "-translate-x-full"
      } fixed h-screen flex flex-col space-y-4 shadow-xl duration-300 ease-in-out transition-transform bg-gray-100 z-30 pt-16 md:pt-20 top-0 left-0 w-64 md:w-80 lg:w-96`}
    >
      {/* Close button for mobile */}
      <div className="absolute top-3 right-3 md:hidden">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <IonIcon icon={closeOutline} style={{ fontSize: "24px" }} />
        </button>
      </div>

      <div className="rounded-lg p-3 md:p-4 flex space-x-4 md:space-x-6 hover:bg-[#ffe9eb] duration-100">
        <IonIcon
          icon={homeOutline}
          style={{ fontSize: "24px" }}
          className="md:text-3xl"
        />
        <a href="/" className="text-lg md:text-2xl font-md">
          Accueil
        </a>
      </div>

      <div className="rounded-lg p-3 md:p-4 flex space-x-4 md:space-x-6 hover:bg-[#ffe9eb] duration-500">
        <IonIcon
          icon={peopleCircleOutline}
          style={{ fontSize: "24px" }}
          className="md:text-3xl"
        />
        <a href="/team" className="text-lg md:text-2xl font-md">
          Equipe
        </a>
      </div>

      <div className="rounded-lg p-3 md:p-4 flex space-x-4 md:space-x-6 hover:bg-[#ffe9eb] duration-500">
        <IonIcon
          icon={calendarOutline}
          style={{ fontSize: "24px" }}
          className="md:text-3xl"
        />
        <a href="/orders" className="text-lg md:text-2xl font-md">
          Agende
        </a>
      </div>

      <div className="rounded-lg p-3 md:p-4 flex space-x-4 md:space-x-6 hover:bg-[#ffe9eb] duration-500">
        <IonIcon
          icon={cartOutline}
          style={{ fontSize: "24px" }}
          className="md:text-3xl"
        />
        <a href="" className="text-lg md:text-2xl font-md">
          Tpe
        </a>
      </div>

      <div className="rounded-lg p-3 md:p-4 flex space-x-4 md:space-x-6 hover:bg-[#ffe9eb] duration-500">
        <IonIcon
          icon={settingsOutline}
          style={{ fontSize: "24px" }}
          className="md:text-3xl"
        />
        <a href="/settings" className="text-lg md:text-2xl font-md">
          Paramètres
        </a>
      </div>
    </div>
  );
};

export default SideBar;
