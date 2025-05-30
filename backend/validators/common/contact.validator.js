import validator from "validator";

export const validatePhone = (phone) => {
  if (!validator.isMobilePhone(phone, "fr-FR")) {
    throw new Error("Le numéro de téléphone est invalide");
  }
  return true;
};

export const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error("L'email est invalide");
  }
  return true;
};
