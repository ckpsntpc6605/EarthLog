import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { addNewProject, getAllProjectData } from "../../utils/firebase";
import { usePostData } from "../../context/dataContext";
import { Plus } from "lucide-react";

export default function TravelProject() {
  const navigate = useNavigate();
  const { currentUser } = usePostData();
  const [projectDatas, setProjectDatas] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const path = `/users/${currentUser.id}/travelProject`;
    async function fetchProjectData() {
      const docSnapshot = await getAllProjectData(path);
      setProjectDatas(docSnapshot);
    }
    fetchProjectData();
  }, [currentUser]);

  console.log(projectDatas);

  const handleAddNewProject = async () => {
    const path = `/users/${currentUser.id}/travelProject`;
    const projectID = await addNewProject(path);
    await navigate(`/project/${projectID}`);
  };

  return (
    <div className="p-3 flex-1 bg-[#2b2d42] rounded-b-lg relative">
      <button
        className="btn btn-sm absolute bottom-2 right-2 px-1"
        onClick={handleAddNewProject}
      >
        <Plus size={20} />
      </button>
      <div className="divider font-semibold text-slate-400 text-2xl ">
        所有計劃
      </div>
      <ul role="list" className="divide-y divide-gray-100">
        {projectDatas.map((project) => (
          <li
            key={project.id}
            className="flex justify-between gap-x-6 py-5 bg-[#2A9D8F] px-3 rounded-md"
          >
            <Link
              to={`/project/${project.id}`}
              className="flex min-w-0 gap-x-4"
            >
              <div className="min-w-0 flex-auto">
                <p className="text-lg font-semibold leading-6 text-gray-900 ">
                  {project.projectName}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {project.country}
                </p>
              </div>
            </Link>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">
                出發日期：{project.date}
              </p>
              {/* {project.lastSeen ? (
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Last seen <time dateTime={project.lastSeenDateTime}>{project.lastSeen}</time>
              </p>
            ) : (
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs leading-5 text-gray-500">Online</p>
              </div>
            )} */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
