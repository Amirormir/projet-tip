export const validateInstalledPower = (power) => {
  if (power <= 0 || power > 1000) {
    throw new Error(
      "La puissance installée doit être comprise entre 0 et 1000 MWc"
    );
  }
  return true;
};

export const validateSurface = (surface) => {
  if (surface <= 0 || surface > 1000000) {
    throw new Error("La surface doit être comprise entre 0 et 1 000 000 m²");
  }
  return true;
};

export const validatePanelCount = (count) => {
  if (count <= 0 || count > 1000000) {
    throw new Error(
      "Le nombre de panneaux doit être compris entre 0 et 1 000 000"
    );
  }
  return true;
};

export const validatePanelOrientation = (orientation) => {
  if (orientation < 0 || orientation > 360) {
    throw new Error("L'orientation doit être comprise entre 0 et 360 degrés");
  }
  return true;
};

export const validatePanelTilt = (tilt) => {
  if (tilt < 0 || tilt > 90) {
    throw new Error("L'inclinaison doit être comprise entre 0 et 90 degrés");
  }
  return true;
};
