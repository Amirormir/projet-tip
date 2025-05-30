import validator from "validator";

export const validateAddress = (address) => {
  if (!validator.isLength(address, { min: 3, max: 100 })) {
    throw new Error("L'adresse doit contenir entre 3 et 100 caractères");
  }
  return true;
};

export const validateZipCode = (zipCode) => {
  if (!validator.isPostalCode(zipCode, "FR")) {
    throw new Error("Le code postal est invalide");
  }
  return true;
};

export const validateCity = (city) => {
  if (!validator.isLength(city, { min: 2, max: 50 })) {
    throw new Error("La ville doit contenir entre 2 et 50 caractères");
  }
  return true;
};
