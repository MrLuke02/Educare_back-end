function fileNameValidation(fileName: string) {
  const regex = /\W|\_/g;
  const regexCaptureExtension = /(.*)(\.pdf|\.doc|\.docs)/;

  const extension = fileName.replace(regexCaptureExtension, "$2");
  const name = fileName.replace(regexCaptureExtension, "$1");

  return `${name.replace(regex, "")}${extension}`;
}

export { fileNameValidation };
