import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  addNewProject,
  getAllProjectData,
  deleteProject,
  addNewDayPlan,
} from "../../utils/firebase";
import { usePostData } from "../../context/dataContext";
import { Plus, Trash2, MapPin, NotebookPen } from "lucide-react";
import "animate.css";

export default function TravelProject() {
  const navigate = useNavigate();
  const { currentUser } = usePostData();
  const [projectDatas, setProjectDatas] = useState([]);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [postsByMonth, setPostsByMonth] = useState({});

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
    const dayPlanPath = `/users/${currentUser.id}/travelProject/${projectID}/dayPlans/day1`;
    await addNewDayPlan(dayPlanPath);
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

  useEffect(() => {
    const postsByMonth = projectDatas.reduce((accumulator, post) => {
      const month = post.date.slice(0, 7);

      if (accumulator.hasOwnProperty(month)) {
        accumulator[month].push(post);
      } else {
        accumulator[month] = [post];
      }

      return accumulator;
    }, {});
    setPostsByMonth(postsByMonth);
  }, [projectDatas]);

  return (
    <div className="p-5 flex-1 bg-[#F0F5F9] rounded-b-lg relative ">
      <Alert isDeleteSuccess={isDeleteSuccess} />
      <button
        className="btn btn-sm absolute bottom-2 right-2 px-1"
        onClick={handleAddNewProject}
      >
        <Plus size={20} />
      </button>
      {/* <div className="divider divider-neutral font-semibold text-slate-400 text-2xl">
        所有計劃
      </div> */}
      <div className="h-auto border-l border-gray-400 border-l-2 pl-4 ml-3">
        {Object.entries(postsByMonth).map(([month, projects]) => (
          <React.Fragment key={month}>
            <div className="divider divider-neutral font-semibold text-[#52616B] text-2xl">
              {month}
            </div>
            <ul role="list" className="divide-y divide-gray-100">
              {projects.map((project) => (
                <React.Fragment key={project.id}>
                  <li
                    key={project.id}
                    className="flex py-6 bg-[#C9D6DF] text-white px-3 rounded-md mb-3 shadow-[5px_5px_4px_rgba(0,0,0,.4)] hover:bg-[linear-gradient(90deg,_#d0dbe8,_#f7f7ff)] hover:text-white animate__animated animate__zoomInRight animate__animated"
                  >
                    <Link
                      to={`/project/${project.id}`}
                      className="shrink-0 self-center mr-4"
                    >
                      <NotebookPen size={36} />
                    </Link>
                    <Link
                      to={`/project/${project.id}`}
                      className="flex min-w-0 gap-x-4 mr-auto"
                    >
                      <div className="min-w-0 flex-auto">
                        <p className="text-xl font-semibold leading-6 text-[#1E2022] mb-4">
                          {project.projectName === ""
                            ? "未命名的計畫"
                            : project.projectName}
                        </p>
                        <p className="text-sm leading-6 text-gray-500">
                          日期：{project.date} ～ {project.endDate}
                        </p>
                      </div>
                    </Link>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:justify-between">
                      <div className="flex gap-1 items-center">
                        <MapPin size={20} color="#52616B" />
                        <p className="truncate text-md leading-5 text-[#52616B]">
                          {project.country}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          document
                            .getElementById(`deleteProjectBtn_${project.id}`)
                            .showModal()
                        }
                        className="flex justify-end"
                      >
                        <Trash2 className="text-gray-500 hover:text-[#34373b]" />
                      </button>
                    </div>
                  </li>
                  <dialog
                    id={`deleteProjectBtn_${project.id}`}
                    className="modal"
                  >
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">確定要刪除嗎?</h3>
                      <div className="modal-action">
                        <form method="dialog">
                          <button
                            className="btn mr-3 text-error"
                            onClick={() => handleDeteleProject(project?.id)}
                          >
                            刪除
                          </button>
                          <button className="btn">取消</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </React.Fragment>
              ))}
            </ul>
          </React.Fragment>
        ))}
        {/* <div className="divider divider-neutral font-semibold text-slate-400 text-2xl">
          May , 2024
        </div>
        <ul role="list" className="divide-y divide-gray-100">
          {projectDatas.map((project) => (
            <>
              <li
                key={project.id}
                className="flex justify-between gap-x-6 py-6 bg-gradient-to-r from-gray-200 to-gray-600 px-3 rounded-md mb-3 animate__animated animate__zoomInRight animate__animated"
              >
                <Link
                  to={`/project/${project.id}`}
                  className="flex min-w-0 gap-x-4"
                >
                  <div className="min-w-0 flex-auto">
                    <p className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                      {project.projectName === ""
                        ? "未命名的計畫"
                        : project.projectName}
                    </p>
                    <div className="flex gap-2 items-center">
                      <MapPin size={20} />
                      <p className="truncate text-md leading-5 text-gray-600">
                        {project.country}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-md leading-6 text-gray-900 mb-4">
                    日期：{project.date} - {project.endDate}
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
        </ul> */}
      </div>
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
