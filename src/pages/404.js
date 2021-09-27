import React from "react";
import { Link } from "gatsby";

export default function NotFound() {
  return (
    <div>
      <p>no hay nada que ver aquí.</p>
      <Link to="/">volver al inicio.</Link>
    </div>
  );
}
