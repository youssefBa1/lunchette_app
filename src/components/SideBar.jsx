import { IonIcon } from "@ionic/react";
import {
  homeOutline,
  peopleCircleOutline,
  cartOutline,
  calendarOutline,
} from "ionicons/icons";
const SideBar = ({ isCollapsed }) => {
  return (
    <div
      className={` ${
        isCollapsed == false ? `w-0 ` : "w-96 p-4  "
      }h-screen  flex flex-col space-y-6 fixed shadow-xl duration-100  ease-in-out transition-all bg-gray-100 z-30`}
    >
      {isCollapsed && (
        <>
          <div className="rounded-lg p-4  flex space-x-6 mt-20 hover:bg-[#ffe9eb] duration-100">
            <IonIcon icon={homeOutline} style={{ fontSize: "30px" }}></IonIcon>{" "}
            <a href="/" className="text-2xl font-md">
              Accueil
            </a>
          </div>
          <div className="rounded-lg p-4  flex space-x-6 hover:bg-[#ffe9eb] duration-500">
            <IonIcon
              icon={peopleCircleOutline}
              style={{ fontSize: "30px" }}
            ></IonIcon>{" "}
            <a href="/team" className="text-2xl font-md">
              Equipe
            </a>
          </div>
          <div className="rounded-lg p-4  flex space-x-6 hover:bg-[#ffe9eb] duration-500">
            <IonIcon
              icon={calendarOutline}
              style={{ fontSize: "30px" }}
            ></IonIcon>{" "}
            <a href="/orders" className="text-2xl font-md">
              Agende
            </a>
          </div>
          <div className="rounded-lg p-4  flex space-x-6 hover:bg-[#ffe9eb] duration-500">
            <IonIcon icon={cartOutline} style={{ fontSize: "30px" }}></IonIcon>{" "}
            <a href="" className="text-2xl font-md">
              Tpe
            </a>
          </div>
        </>
      )}
    </div>
  );
};
export default SideBar;
