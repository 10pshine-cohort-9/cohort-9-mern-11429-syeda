
import "./Button.css";

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className="primary-button"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;