function validationEmail(email: string) {
  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return regex.test(email);
  // const emailValido = /^.{3,}@.{3,}[\.][a-z]{2,}$/;
}

export { validationEmail };
