import { IonIcon } from "@ionic/react";
import { createOutline, trashOutline, closeOutline } from "ionicons/icons";

const OrderModal = ({ show }) => {
  return (
    <div
      className={`${
        show ? "opacity-100 scale-100" : "opacity-100 scale-0"
      }  bg-[#f0f4f9] shadow-2xl transform flex flex-col items-center space-y-6 p-4  h-auto w-[30%] top-[10%] left-[20%] fixed rounded-3xl b
  transition-all duration-200  overflow-y-scroll overflow-x-hidden scrollbar-hide text-xl `}
    >
      <div className="w-full flex justify-end space-x-8">
        <div className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300">
          <IonIcon
            icon={createOutline}
            style={{ fontSize: "25px", color: "#444746" }}
          />
        </div>
        <div className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300">
          <IonIcon
            icon={trashOutline}
            style={{ fontSize: "25px", color: "#444746" }}
          />
        </div>
        <div className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300">
          <IonIcon
            icon={closeOutline}
            style={{ fontSize: "25px", color: "#444746" }}
          />
        </div>
      </div>
      <div className="w-full ml-20 ">
        <h1 className="text-2xl mb-2">Mme sahar Ramdhan </h1>
        <span className="text-lg text-gray-500">21/10/2024 10:15 </span>
      </div>
      <div className="mt-4 w-full ml-20 flex flex-col space-y-4 text-lg">
        <span>24282828</span>
        <span>20 piece lafif </span>
        <span></span>
      </div>
    </div>
  );
};
export default OrderModal;
