import { IonIcon } from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  addCircleOutline,
} from "ionicons/icons";

const PurchasesHeader = ({
  selectedDate,
  setSelectedDate,
  months,
  handleAddModal,
}) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <IonIcon icon={chevronBackOutline} />
        </button>
        <span className="text-lg font-medium">{formatDate(selectedDate)}</span>
        <button
          onClick={() => changeDate(1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <IonIcon icon={chevronForwardOutline} />
        </button>
      </div>
      <IonIcon
        onClick={() => handleAddModal()}
        className="!blur-none hover:rotate-45 rounded-full duration-300 opacity-100 cursor-pointer"
        icon={addCircleOutline}
        style={{ fontSize: "35px", color: "#fca5a5" }}
      />
    </div>
  );
};

export default PurchasesHeader;
