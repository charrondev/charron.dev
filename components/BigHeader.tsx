/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import classNames from "classnames";
import styles from "./components.module.scss";

interface IProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function BigHeader(props: IProps) {
    return (
        <h1
            {...props}
            className={classNames(props.className, styles.BigHeader)}
        >
            {props.children}
            <span className={styles.BigHeaderDecorator1}></span>
            <span className={styles.BigHeaderDecorator2}></span>
        </h1>
    );
}
