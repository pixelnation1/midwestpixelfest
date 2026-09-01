import { ArcadeIcon, type ArcadeIconName } from "@/components/retro/ArcadeIcon";

export type ExploreIconName = ArcadeIconName;

type ExploreIconProps = {
  name: ExploreIconName;
};

export function ExploreIcon({ name }: ExploreIconProps) {
  return <ArcadeIcon name={name} />;
}
