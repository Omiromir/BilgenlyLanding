import { Link } from "react-router";
import logoPng from "../../assets/logo.png";

interface BilgenlyLogoProps {
  size?: number;
  showText?: boolean;
}

export function BilgenlyLogo({
  size = 40,
  showText = true,
}: BilgenlyLogoProps) {
  return (
    <Link to="/" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <img
        src={logoPng}
        alt="Bilgenly Logo"
        style={{ width: size, height: size, display: "block" }}
      />
      {showText ? (
        <span className="auth-brand-name text-xl font-semibold">Bilgenly</span>
      ) : null}
    </Link>
  );
}
