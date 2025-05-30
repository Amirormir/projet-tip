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

export const validateCoordinates = (coordinates) => {
  const { latitude, longitude, altitude } = coordinates;

  if (latitude < -90 || latitude > 90) {
    throw new Error("La latitude doit être comprise entre -90 et 90 degrés");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("La longitude doit être comprise entre -180 et 180 degrés");
  }

  if (altitude < -1000 || altitude > 10000) {
    throw new Error(
      "L'altitude doit être comprise entre -1000 et 10000 mètres"
    );
  }

  return true;
};
