/*** FORMS ***/
export const handleInputChange = (setFormData, e) => {
  const { name, value, type, checked } = e.target;
  
  setFormData(prevState => ({
    ...prevState,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

export const validateForm = (formData, setError) => {
  if (formData.password !== formData.confirmPassword) {
    setError("Les mots de passe ne correspondent pas");
    return false;
  }
  if (formData.password.length < 6) {
    setError("Le mot de passe doit faire au moins 6 caractères");
    return false;
  }
  return true;
};