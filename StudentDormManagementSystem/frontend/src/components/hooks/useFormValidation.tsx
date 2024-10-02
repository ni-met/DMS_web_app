import React, {useCallback, useState} from 'react'

const useFormValidation = <T extends Record<string, any>, K extends Record<string, any>>(
    initialFormData: T,
    fieldValidators: K
) => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState<any>({});
    const [touched, setTouched] = useState<any>({});

    const validateField = useCallback(
        (name: string, value: string) => {
            let error = ''

            if (fieldValidators[name]) {
                error = fieldValidators[name](value)
            }

            setErrors((prevState: any) => ({
                ...prevState,
                [name]: error,
            }))
        }, [fieldValidators]);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const {name, type, checked, value} = event.target;

            setFormData((prevState) => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value,
            }))

            validateField(name, value);
        }, [validateField]);

    const handleBlur = useCallback(
        (event: any) => {
            const {name, value} = event.target

            setTouched((prevState: any) => ({
                ...prevState,
                [name]: true,
            }))

            validateField(name, value);
        }, [validateField]);

    const validate = useCallback(() => {
        const newErrors = Object.entries(formData).reduce((acc, [key, val]) => {
            if (fieldValidators[key]) {
                const error = fieldValidators[key](val as string)
                if (error) {
                    return {...acc, [key]: error}
                }
            }
            return acc;
        }, {})

        const touchedFields = Object.keys(formData).reduce((acc, key) => ({...acc, [key]: true}), {});

        setTouched(touchedFields);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, fieldValidators]);

    return {
        formData,
        setFormData,
        errors,
        touched,
        handleChange,
        handleBlur,
        validate,
    }
};

export default useFormValidation;
