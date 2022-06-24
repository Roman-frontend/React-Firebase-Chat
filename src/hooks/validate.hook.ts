import { useState, useCallback } from "react";

interface IUseValidateProps {
  [key: string]: (name: string) => string | boolean;
}

interface IPropsValidate {
  [name: string]: any;
  isError?: boolean | string;
}

interface IError {
  name?: string | null;
  surname?: string | null;
  email?: string | null;
  password?: string | null;
  isError?: string | boolean;
}

const ERROR_ALERT = "Некоректні дані при реєстрації";

export const useValidate = (validateFields: IUseValidateProps) => {
  const [errors, setErrors] = useState<IError>({});

  const validate = useCallback(
    (inputValue: IPropsValidate) => {
      let resultValidate: IPropsValidate = {};

      for (let fieldName in validateFields) {
        const value = inputValue[fieldName];
        const validatedForm: string | boolean =
          validateFields[fieldName](value);
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
