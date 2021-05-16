function validationEmail(email: string) {
  const regex = /^.{3,}@.{3,}[\.][a-z]{2,}$/;

  return regex.test(email);
  // /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
}

export { validationEmail };
