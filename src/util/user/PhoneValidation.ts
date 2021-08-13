function validationPhone(phoneNumber: string) {
  const regex = /^[+]\d{2}\s\(\d{2}\)\s\d[.]\d{4}[-]\d{4}$/;

  return regex.test(phoneNumber);
  // +55 (88) 9.8989-8989
}

export { validationPhone };
