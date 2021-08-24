function verifyStatus(status: string, obj: Object) {
  const arrayStatus = Object.keys(obj);

  return arrayStatus.includes(status);
}

export { verifyStatus };
