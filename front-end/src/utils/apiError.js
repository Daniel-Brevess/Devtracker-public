export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error.response?.data;

  if (responseData?.fieldErrors) {
    return Object.values(responseData.fieldErrors).join(" ");
  }

  return responseData?.message || error.message || fallbackMessage;
}
