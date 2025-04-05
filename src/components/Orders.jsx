const Order = ({ order, func }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-300 hover:bg-red-400";
      case "ready":
        return "bg-blue-300 hover:bg-blue-400";
      case "completed":
        return "bg-green-300 hover:bg-green-400";
      default:
        return "bg-red-300 hover:bg-red-400";
    }
  };

  return (
    <div
      className={`${getStatusColor(
        order.status
      )} h-20 w-auto ml-8 rounded-xl flex flex-col p-2 text-gray-600 font-bold cursor-pointer transition-colors duration-200`}
      onClick={(e) => func(e)}
    >
      <p>{order.customerName}</p>
      <p>{order.orderTime}</p>
      <p>{order.customerNumber}</p>
    </div>
  );
};

export default Order;
