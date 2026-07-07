import styles from "./sprite-icon.module.css";

type SpriteIconProps = {
  id: string;
  width?: number;
  height?: number;
  className?: string;
};

export function SpriteIcon({
  id,
  width = 24,
  height = 24,
  className = "",
}: SpriteIconProps) {
  return (
    <svg
      className={`${styles.icon} ${className}`}
      width={width}
      height={height}
      aria-hidden="true"
    >
      <use href={`/icons/sprite.svg#${id}`} />
    </svg>
  );
}