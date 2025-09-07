/*** FORMS ***/
export const handleInputChange = (setFormData, e) => {
  const { name, value, type, checked } = e.target;
  
  let inputValue;
  if (type === 'checkbox') {
    inputValue = checked;
  } else if (type === 'file') {
    inputValue = e.target.files[0];
  } else {
    inputValue = value;
  }

  setFormData(prevState => ({
    ...prevState,
    [name]: inputValue
  }));

}

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