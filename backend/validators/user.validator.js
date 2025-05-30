import validator from "validator";

export const validateUsername = (username) => {
  if (!validator.isLength(username, { min: 3, max: 20 })) {
    throw new Error(
      "Le nom d'utilisateur doit être compris entre 3 et 20 caractères"
    );
  }
  if (/\d+/.test(username)) {
    throw new Error("Le nom d'utilisateur ne peut pas contenir de chiffres");
  }
  return true;
};

export const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error("L'email est invalide");
  }
  return true;
};

export const validatePassword = (password) => {
  const isStrong = validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
  if (!isStrong) {
    throw new Error(
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole"
    );
  }
  return true;
};
