import React from "react";
import { Link } from "react-router-dom";

export default function TravelProject() {
  return (
    <div>
      <Link to={"/project/edit"} className="btn">
        add new project
      </Link>
    </div>
  );
}
