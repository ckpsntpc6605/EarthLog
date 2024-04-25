import React from "react";
import { useNavigate } from "react-router-dom";
import { addNewProject } from "../../utils/firebase";
import { usePostData } from "../../context/dataContext";

export default function TravelProject() {
  const navigate = useNavigate();
  const { currentUser } = usePostData();

  const handleAddNewProject = async () => {
    const path = `/users/${currentUser.id}/travelProject`;
    const projectID = await addNewProject(path);
    await navigate(`/project/${projectID}`);
  };

  return (
    <div>
      <button className="btn" onClick={handleAddNewProject}>
        add new project
      </button>
    </div>
  );
}
