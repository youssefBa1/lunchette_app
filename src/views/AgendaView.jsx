import NavBar from "../components/NavBar";
import { IonIcon } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import CalendarApp from "../components/Calendar";
function AgendaView() {
  return (
    <>
      <NavBar></NavBar>
      <div className="pt-20 h-max flex flex-row">
        <div className="w-[100%] h-screen ">
          <CalendarApp></CalendarApp>
        </div>
      </div>
    </>
  );
}

export default AgendaView;
