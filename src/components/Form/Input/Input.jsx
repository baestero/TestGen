import React from "react";
import styles from "./Input.module.css";

const Input = ({
  type,
  name,
  value,
  onChange,
  error,
  onBlur,
  placeholder,
  label,
  ...rest
}) => {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={styles.input}
        type={type}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        placeholder={placeholder}
        {...rest}
      ></input>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Input;
