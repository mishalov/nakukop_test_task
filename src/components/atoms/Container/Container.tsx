import React, { HTMLProps } from "react";
import styles from "./Container.module.scss";
import cn from "classnames";

const Container: React.FC<HTMLProps<HTMLDivElement>> = (props) => (
  <div className={cn(styles.container, props.className)}>{props.children}</div>
);

export default Container;
