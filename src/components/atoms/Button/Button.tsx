import React, { HTMLProps } from "react";
import styles from "./Button.module.scss";
import cn from "classnames";

interface IButtonProps extends HTMLProps<HTMLButtonElement> {}

const Button: React.FC<IButtonProps> = (props) => (
  <button
    {...props}
    type="button"
    className={cn(styles.button, props.className)}
  >
    {props.children}
  </button>
);

export default Button;
