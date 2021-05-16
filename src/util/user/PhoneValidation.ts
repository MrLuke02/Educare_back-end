function validationPhone(phoneNumber: string) {
  const regex = /^(\+\d{2}\s)?(\(\d{2}\)\s)?(9\.|9)?\d{4}[-]?\d{4}$/;

  return regex.test(phoneNumber);
  // 89898989
  // 8989-8989
  // 98989-8989
  // 9.8989-8989
  // (88) 9.8989-8989
  // +55 (88) 9.8989-8989
}

export { validationPhone };
