function validationPhone(phoneNumber: string) {
  const regex = /^(\+\d{2}\s)?(\(\d{2}\)\s)?(9\.|9)?\d{4}[-]?\d{4}$/;

  return regex.test(phoneNumber);
  //
}

export { validationPhone };
