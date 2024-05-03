import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  addNewProject,
  getAllProjectData,
  deleteProject,
} from "../../utils/firebase";
import { usePostData } from "../../context/dataContext";
import { Plus, Trash2 } from "lucide-react";
import "animate.css";

export default function TravelProject() {
  const navigate = useNavigate();
  const { currentUser } = usePostData();
  const [projectDatas, setProjectDatas] = useState([]);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!currentUser) return;
    const path = `/users/${currentUser.id}/travelProject`;
    async function fetchProjectData() {
      const docSnapshot = await getAllProjectData(path);
      setProjectDatas(docSnapshot);
    }
    fetchProjectData();
  }, [currentUser, isDeleteSuccess]);

  useEffect(() => {}, [isDeleteSuccess]);

  const handleAddNewProject = async () => {
    const path = `/users/${currentUser.id}/travelProject`;
    const projectID = await addNewProject(path);
    await navigate(`/project/${projectID}`);
  };

  const handleDeteleProject = async (id) => {
    const path = `/users/${currentUser.id}/travelProject/${id}`;
    try {
      const result = await deleteProject(path);
      setIsDeleteSuccess(result);
      const timer = setTimeout(() => {
        setIsDeleteSuccess(null);
      }, 3000);

      return () => clearTimeout(timer);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-3 flex-1 bg-[#2b2d42] rounded-b-lg relative ">
      <Alert isDeleteSuccess={isDeleteSuccess} />
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
          <>
            <li
              key={project.id}
              className="flex justify-between gap-x-6 py-5 bg-[#2A9D8F] px-3 rounded-md mb-3 animate__animated animate__zoomInRight animate__animated"
            >
              <Link
                to={`/project/${project.id}`}
                className="flex min-w-0 gap-x-4"
              >
                <div className="min-w-0 flex-auto">
                  <p className="text-lg font-semibold leading-6 text-gray-900 ">
                    {project.projectName === ""
                      ? "未命名的計畫"
                      : project.projectName}
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
                <button
                  onClick={() =>
                    document.getElementById("deleteProjectBtn").showModal()
                  }
                >
                  <Trash2 />
                </button>
              </div>
            </li>
            <dialog id="deleteProjectBtn" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">確定要刪除嗎?</h3>
                <div className="modal-action">
                  <form method="dialog">
                    <button
                      className="btn mr-3 text-error"
                      onClick={() => handleDeteleProject(project.id)}
                    >
                      刪除
                    </button>
                    <button className="btn">取消</button>
                  </form>
                </div>
              </div>
            </dialog>
          </>
        ))}
      </ul>
    </div>
  );
}

function Alert({ isDeleteSuccess }) {
  return (
    <>
      {isDeleteSuccess !== null && (
        <div className="toast toast-top toast-center animate__animated animate__fadeOutLeft animate__delay-2s">
          {isDeleteSuccess ? (
            <div className="alert alert-success">
              <span>刪除成功</span>
            </div>
          ) : (
            <div className="alert alert-error">
              <span>刪除失敗</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
