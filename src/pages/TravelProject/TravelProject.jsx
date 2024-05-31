import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  addNewProject,
  getAllProjectData,
  deleteProject,
  addNewDayPlan,
} from "../../utils/firebase";
import useAuthListener from "../../utils/hooks/useAuthListener";
import { Trash2, MapPin, NotebookPen, SquarePen } from "lucide-react";
import "animate.css";
import CalendarComponent from "../../components/Calendar/Calendar";

export default function TravelProject() {
  const navigate = useNavigate();
  const currentUser = useAuthListener();
  const [projectDatas, setProjectDatas] = useState([]);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(null);
  const [postsByMonth, setPostsByMonth] = useState({});
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [filteredProjects, setFilteredProjects] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setFilteredProjects(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (Object.keys(currentUser).length === 0) return;
    const path = `/users/${currentUser.id}/travelProject`;
    async function fetchProjectData() {
      const docSnapshot = await getAllProjectData(path);
      setProjectDatas(docSnapshot);
    }
    fetchProjectData();
  }, [currentUser, isDeleteSuccess]);

  useEffect(() => {
    const postsByMonth = projectDatas?.reduce((accumulator, post) => {
      const month = post?.date.slice(0, 7);

      if (accumulator.hasOwnProperty(month)) {
        accumulator[month].push(post);
      } else {
        accumulator[month] = [post];
      }

      return accumulator;
    }, {});

    const sortedPostsByMonth = Object.entries(postsByMonth).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    const sortedPostsByMonthObject = sortedPostsByMonth.reduce(
      (accumulator, [month, posts]) => {
        accumulator[month] = posts;
        return accumulator;
      },
      {}
    );

    setPostsByMonth(sortedPostsByMonthObject);
  }, [projectDatas]);

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

  return (
    <div className="p-7 flex-1 bg-[#F0F5F9] rounded-b-lg relative ">
      <Alert isDeleteSuccess={isDeleteSuccess} />
      <button
        className="absolute bottom-7 right-7 bg-text_primary rounded-xl p-3"
        onClick={handleAddNewProject}
      >
        <SquarePen size={16} color="#C9D6DF" />
      </button>

      <div
        ref={calendarRef}
        className="flex w-full justify-center calendar_container"
      >
        <CalendarComponent
          calendarValue={calendarValue}
          setCalendarValue={setCalendarValue}
          projectDatas={projectDatas}
          setFilteredProjects={setFilteredProjects}
        />
      </div>
      <div className="h-auto">
        {filteredProjects === null && postsByMonth ? (
          Object.entries(postsByMonth).map(([month, projects]) => (
            <React.Fragment key={month}>
              <div className="mb-14">
                <div className="divider divider-neutral font-semibold text-text_secondary text-2xl">
                  {month}
                </div>
                <ul role="list" className="divide-y divide-gray-100">
                  {projects.map((project) => (
                    <React.Fragment key={project.id}>
                      <li
                        key={project.id}
                        className="flex py-6 mb-5 bg-bg_primary text-white px-3 rounded-md shadow-[5px_5px_4px_rgba(0,0,0,.4)] hover:bg-[linear-gradient(90deg,_#d0dbe8,_#f7f7ff)] hover:text-white animate__animated animate__fadeInRight animate__animated"
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
                            <p className="text-xl font-semibold leading-6 text-text_primary mb-4 sm:truncate xl:truncate-none">
                              {project.projectName === ""
                                ? "未命名的計畫"
                                : project.projectName}
                            </p>
                            <p className="text-sm leading-6 text-gray-500">
                              日期：{project.date} ～{" "}
                              {project.endDate.substring(
                                project.endDate.length - 5
                              )}
                            </p>
                          </div>
                        </Link>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:justify-between">
                          <div className="flex gap-1 items-center">
                            <MapPin size={20} color="#52616B" />
                            <p className="sm:truncate xl:truncate-none text-md leading-5 text-text_secondary">
                              {project.country}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              document
                                .getElementById(
                                  `deleteProjectBtn_${project.id}`
                                )
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
              </div>
            </React.Fragment>
          ))
        ) : filteredProjects?.length !== 0 ? (
          <>
            <div className="divider divider-neutral font-semibold text-text_secondary text-2xl">
              {filteredProjects?.[0].date}
            </div>
            <ul role="list" className="divide-y divide-gray-100">
              {filteredProjects?.map((project) => (
                <React.Fragment key={project.id}>
                  <li
                    key={project.id}
                    className="flex py-6 mb-5 bg-bg_primary text-white px-3 rounded-md shadow-[5px_5px_4px_rgba(0,0,0,.4)] hover:bg-[linear-gradient(90deg,_#d0dbe8,_#f7f7ff)] hover:text-white animate__animated animate__fadeInRight animate__animated"
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
                        <p className="text-xl font-semibold leading-6 text-text_primary mb-4 sm:truncate xl:truncate-none">
                          {project.projectName === ""
                            ? "未命名的計畫"
                            : project.projectName}
                        </p>
                        <p className="text-sm leading-6 text-gray-500">
                          日期：{project.date} ～{" "}
                          {project.endDate.substring(
                            project.endDate.length - 5
                          )}
                        </p>
                      </div>
                    </Link>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:justify-between">
                      <div className="flex gap-1 items-center">
                        <MapPin size={20} color="#52616B" />
                        <p className="sm:truncate xl:truncate-none text-md leading-5 text-text_secondary">
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
          </>
        ) : (
          <p className="text-text_secondary text-center my-4 text-xl">
            當天尚無計畫
          </p>
        )}
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
            <div className="alert bg-green-100 border-green-100 text-green-600 font-semibold shadow-lg">
              <span>刪除成功</span>
            </div>
          ) : (
            <div className="alert bg-red-200 border-red-200 text-red-600 font-semibold shadow-lg">
              <span>刪除失敗</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
