import { useState, useCallback } from "react";

const ERROR_ALERT = "Некоректні дані при реєстрації";

export const useValidate = (validateFields) => {
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    (inputValue) => {
      let resultValidate = {};

      for (let fieldName in validateFields) {
        const validatedForm = validateFields[fieldName](inputValue[fieldName]);
        resultValidate[fieldName] = validatedForm;
      }

      resultValidate.isError = Object.values(resultValidate).find(
        (value) => typeof value === "string"
      )
        ? ERROR_ALERT
        : false;

      setErrors({ ...resultValidate });
      return !!!resultValidate.isError;
    },
    [validateFields]
  );

  return { errors, validate };
};
