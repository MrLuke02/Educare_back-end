function validationNumber(number: string | number) {
  let convertedNumber = number;

  if (typeof convertedNumber === "string") {
    convertedNumber = Number(convertedNumber);
  }

  return convertedNumber;
}

export { validationNumber };
