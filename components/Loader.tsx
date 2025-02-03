import classNames from "classnames";
import classes from "./Loader.module.scss";

export function Loader() {
    return (
        <div className={classes.spinner}>
            <div className={classes.dot}></div>
            <div className={classes.dot}></div>
            <div className={classes.dot}></div>
            <div className={classes.dot}></div>
            <div className={classes.dot}></div>
            <div className={classes.dot}></div>
        </div>
    );
}
