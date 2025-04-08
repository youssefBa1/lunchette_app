const Order = ({ order, func }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "notready":
        return "bg-red-300 hover:bg-red-400";
      case "ready":
        return "bg-blue-300 hover:bg-blue-400";
      case "payed":
        return "bg-green-300 hover:bg-green-400";
      default:
        return "bg-red-300 hover:bg-red-400";
    }
  };

  return (
    <div
      className={`${getStatusColor(
        order.status
      )} h-16 sm:h-18 md:h-20 w-auto sm:min-w-[120px] md:min-w-[140px] rounded-xl flex flex-col p-2 text-gray-600 font-bold cursor-pointer transition-colors duration-200`}
      onClick={(e) => func(e)}
    >
      <p className="text-xs sm:text-sm md:text-base truncate">
        {order.customerName}
      </p>
      <p className="text-xs sm:text-sm">{order.orderTime}</p>
      <p className="text-xs sm:text-sm truncate">{order.customerNumber}</p>
    </div>
  );
};

export default Order;
