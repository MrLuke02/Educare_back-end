function validationPhone(phoneNumber: string) {
  const regex = /\+\d{13}/;
  // /^(\+\d{2}\s)?(\(\d{2}\)\s)?(9\.|9)?\d{4}[-]?\d{4}$/

  return regex.test(phoneNumber);
  // +5512989898989;
}

export { validationPhone };
