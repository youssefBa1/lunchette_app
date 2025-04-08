import { IonIcon } from "@ionic/react";
import {
  checkmarkCircleOutline,
  timeOutline,
  walletOutline,
} from "ionicons/icons";

const StatusFilter = ({ selectedStatuses, onStatusChange }) => {
  const statuses = [
    {
      value: "notready",
      label: "En attente",
      icon: timeOutline,
      color: "text-red-600 bg-red-100",
    },
    {
      value: "ready",
      label: "Prêt",
      icon: checkmarkCircleOutline,
      color: "text-blue-600 bg-blue-100",
    },
    {
      value: "payed",
      label: "Payé",
      icon: walletOutline,
      color: "text-green-600 bg-green-100",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
            selectedStatuses.includes(status.value)
              ? status.color + " font-medium"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <IonIcon
            icon={status.icon}
            className="mr-2"
            style={{ fontSize: "18px" }}
          />
          {status.label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
