import styles from "./not-found.module.scss";

export const runtime = "edge";
export const dynamicParams = false;

const STRINGS = [
    "Nothing to see here.",
    "You're lost.",
    "Whoops, wrong turn.",
    "Maybe if you try again there will be a page here?",
    "This page doesn't exist.",
    "Take a left, then another left, then reload the pages 7 more times and you'll be back where you started.",
];

export default async function NotFound() {
    return (
        <div className={styles.root}>
            {STRINGS[Math.floor(Math.random() * STRINGS.length)]}
        </div>
    );
}
