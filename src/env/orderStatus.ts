const OrderStatus = {
  ORDER_CREATED: "Pedido criado",
  ORDER_PAID: "Pedido pago",
  ORDER_ON_PRODUCTION: "Pedido em produção",
  ORDER_UNDER_ANALYSIS: "Pedido em análise",
  ORDER_IN_DELIVERY: "Pedido em rota para entrega",
  ORDER_FINISHED: "Pedido finalizado",
  ORDER_CANCELED: "Pedido cancelado",
};

function verifyStatus(status: string) {
  const arrayOrderStatus = Object.keys(OrderStatus);

  return arrayOrderStatus.includes(status);
}

export { OrderStatus, verifyStatus };
