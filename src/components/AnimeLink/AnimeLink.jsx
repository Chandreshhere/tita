"use client";
import { Link } from "next-view-transitions";

const AnimeLink = ({ label, route }) => {
  return (
    <div className="anime-link">
      <div className="anime-link-label">
        <p>
          <Link className="sm caps mono" href={route}>
            {label}
          </Link>
        </p>
      </div>
      <div className="anime-link-icon"></div>
    </div>
  );
};

export default AnimeLink;
