"use client";
import { Link } from "next-view-transitions";
import { IoMdArrowForward } from "react-icons/io";

import "./AnimeLink.css";

const AnimeLink = ({ label, route, dark = false }) => {
  return (
    <Link
      className={`sm caps mono ${dark ? "link-dark" : "link-light"}`}
      href={route}
    >
      <div
        className={`anime-link ${
          dark ? "anime-link-dark" : "anime-link-light"
        }`}
      >
        <div className="anime-link-label">
          <p className="sm caps mono">
            <span>{label}</span>
          </p>
        </div>
        <div className="anime-link-icon">
          <IoMdArrowForward color={dark ? "#fff" : "#000"} />
        </div>
      </div>
    </Link>
  );
};

export default AnimeLink;
