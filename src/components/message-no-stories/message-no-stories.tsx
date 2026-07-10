import { ButtonLink } from "@/components/buttons/button";
import styles from "./message-no-stories.module.css";

type MessageNoStoriesProps = {
  text: string;
  buttonText: string;
  linkTo: string;
};

export function MessageNoStories({
  text,
  buttonText,
  linkTo,
}: MessageNoStoriesProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>{text}</p>

      <ButtonLink href={linkTo} className={styles.button}>
        {buttonText}
      </ButtonLink>
    </div>
  );
}
