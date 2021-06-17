import React, { HTMLProps } from "react";
import styles from "./EditableText.module.scss";
import cn from "classnames";

interface IEditableTextProps extends HTMLProps<HTMLTextAreaElement> {}
const EditableText: React.FC<IEditableTextProps> = (props) => {
  return <textarea {...props} className={cn(props.className, styles.input)} />;
};

export default EditableText;
