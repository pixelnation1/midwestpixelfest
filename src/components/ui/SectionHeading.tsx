import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "magenta" | "cyan" | "gold" | "lime";
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "magenta",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Badge tone={tone} className={align === "center" ? "mx-auto mb-4" : "mb-4"}>
          {eyebrow}
        </Badge>
      ) : null}
      <h2
        id={id}
        className="font-display text-4xl uppercase leading-[0.95] tracking-wide text-paper sm:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
      <div
        className={cn("pixel-heading-rule mt-4", align === "center" && "mx-auto")}
        aria-hidden="true"
      />
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-lg leading-relaxed text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
