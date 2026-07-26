type IconixCodeCreditProps = {
  variant?: "default" | "dashboard" | "homecoming";
};

export default function IconixCodeCredit({
  variant = "default",
}: IconixCodeCreditProps) {
  const variantClass =
    variant === "dashboard"
      ? " iconixFooterCreditDashboard"
      : variant === "homecoming"
        ? " iconixFooterCreditHomecoming"
        : "";

  return (
    <div className={`iconixFooterCredit${variantClass}`}>
      <span>develop &amp; maintain by </span>

      <a
        href="https://iconixcode.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="iconixFooterBrand"
        aria-label="Visit ICONIXCODE website"
      >
        ICONI<span className="iconixFooterX">X</span>CODE
      </a>
    </div>
  );
}