function verifyStatus(status: string, obj: Object) {
  const arrayOrderStatus = Object.keys(obj);

  return arrayOrderStatus.includes(status);
}

export { verifyStatus };
