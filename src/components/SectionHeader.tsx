type SectionHeaderProps = {
  eyebrow: string;
  title: string | string[];
  description?: string;
  align?: "left" | "center";
  eyebrowSize?: "default" | "large";
  width?: "default" | "wide";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  eyebrowSize = "default",
  width = "default"
}: SectionHeaderProps) {
  const maxWidth = width === "wide" ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className={align === "center" ? `mx-auto ${maxWidth} text-center` : maxWidth}>
      <p
        className={`mb-3 font-semibold uppercase tracking-[0.22em] text-accent ${
          eyebrowSize === "large" ? "text-base sm:text-lg" : "text-sm"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="font-headline text-4xl font-semibold leading-none text-primary sm:text-5xl">
        {Array.isArray(title)
          ? title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))
          : title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-7 text-textSecondary sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
