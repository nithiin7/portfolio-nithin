import React from "react";
import PropTypes from "prop-types";
import styles from "./TextInput.module.scss";

const TextInput = React.forwardRef((props, ref) => {
  const {
    name,
    variant,
    className,
    type,
    placeholder,
    value,
    onChange,
    onBlur,
    disabled,
    errors,
  } = props;

  return (
    <div
      className={`${styles.TextInput} ${
        styles[`TextInput__${variant}`]
      } ${className}`}
    >
      <input
        className="TextInput__input"
        id={name}
        name={name}
        value={value}
        type={type}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label={value}
        disabled={disabled}
      />
      <div className="TextInput__errors">
        {errors && errors.length > 0 && (
          <div className={"TextInput__form-errors"}>
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

TextInput.displayName = "TextInput";

TextInput.defaultProps = {
  className: "",
  type: "text",
  errors: [],
  onChange: () => {},
  onBlur: () => {},
  variant: "default",
  placeholder: "",
  disabled: false,
};

TextInput.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  errors: PropTypes.array,
  disabled: PropTypes.bool,
};

export default TextInput;
