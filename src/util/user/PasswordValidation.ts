function validationPassword(password: string) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\.,]).{8,}$/;

  return regex.test(password);
}

export { validationPassword };
