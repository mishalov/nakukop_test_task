import React, { HTMLProps } from "react";
import styles from "./InputNumber.module.scss";
import cn from "classnames";

interface IInputNumberProps extends HTMLProps<HTMLInputElement> {}

const InputNumber: React.FC<IInputNumberProps> = (props) => (
  <input {...props} type="number" className={cn(styles.input)} />
);

export default InputNumber;
