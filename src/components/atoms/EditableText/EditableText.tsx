import React, { HTMLProps } from "react";
import styles from "./EditableText.module.scss";
import cn from "classnames";

/**
 * Можно (нужно) было использовать здесь textarea
 * но раз это тестовое задание то хочется показать знания по максимуму :D
 */
interface IEditableTextProps extends HTMLProps<HTMLTextAreaElement> {}
const EditableText: React.FC<IEditableTextProps> = (props) => {
  return (
    <textarea {...props} className={cn(props.className, styles.input)}>
      {props.children}
    </textarea>
  );
};

export default EditableText;
