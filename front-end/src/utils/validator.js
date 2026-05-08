export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUsername(username) {
  return /^[a-zA-Z0-9._-]{3,20}$/.test(username);
}

export function isValidName(name) {
  return name.trim().length >= 3;
}

export function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push("at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("1 uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("1 lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("1 number");
  }

  if (!/[@$!%*?&.#_\-]/.test(password)) {
    errors.push("1 symbol");
  }

  return errors;
}

function validateLogin() {
  const newErrors = {};

  if (!formData.identifier.trim()) {
    newErrors.identifier = "Digite seu username ou email.";
  }

  if (!formData.password) {
    newErrors.password = "Digite sua senha.";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
}