function fieldValidation(field, value) {
  if (!value) return false;   // prevent empty validation
  const trimmedValue = value.trim();

  switch (field) {
    case "email":
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedValue);

    case "mobile":
      return /^[6-9][0-9]{9}$/.test(trimmedValue);

    case "regnum":
      return /^2[2-6][a-zA-Z0-9]{8}$/.test(trimmedValue);

    default:
      return false;
  }
}

export default fieldValidation;
