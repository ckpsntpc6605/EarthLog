import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { usePostData } from "../../context/dataContext";
import ReactQuill from "react-quill";
import { StickyNote, Trash2, Plus, LandPlot, Pencil } from "lucide-react";
import {
  saveProject,
  getProjectData,
  saveDayPlansPrepareList,
  getDayPlansData,
  addNewDayPlan,
} from "../../utils/firebase";
import { useDestinationData } from "../../utils/zustand";

// 證件類
const documentItems = [
  ["機票", "planeTicket"],
  ["身份證", "IDCard"],
  ["信用卡", "creditCard"],
  ["國際駕照", "internationalDriverLicense"],
  ["租車證明", "carRentalConfirmation"],
  ["護照正影本", "passportPhotocopy"],
  ["2張2吋證件照", "2InchPhoto"],
  ["飯店住宿確認信", "hotelAccommodationConfirmation"],
  ["數位pcr證明", "digitalPCRProof"],
];

// 衣物類
const clothingItems = [
  ["貼身衣物", "underwear"],
  ["外衣外褲", "outerwear"],
  ["襪子", "socks"],
  ["鞋子", "shoes"],
];

// 盥洗用品類
const toiletryItems = [
  ["牙刷", "toothbrush"],
  ["牙膏", "toothpaste"],
  ["洗面乳", "facialCleanser"],
  ["沐浴乳", "bodyWash"],
  ["洗髮精", "shampoo"],
  ["卸妝水", "makeupRemover"],
];

// 藥品類
const medicineItems = [
  ["暈機藥", "motionSicknessMedication"],
  ["頭痛藥", "headacheMedication"],
  ["感冒藥", "coldMedication"],
  ["止痛藥", "painReliefMedication"],
  ["個人藥品", "personalMedication"],
];

// 電器類
const electronicItems = [
  ["充電器", "charger"],
  ["萬能轉接頭", "universalAdapter"],
  ["行動電源", "powerBank"],
  ["相機", "camera"],
  ["耳機", "earphones"],
  ["記憶卡", "memoryCard"],
  ["網卡", "networkCard"],
];

// 日用品類
const dailyItems = [
  ["隨身酒精瓶", "travelSizeAlcoholBottle"],
  ["防竊小包", "antiTheftPouch"],
  ["護手霜", "handCream"],
  ["眼罩", "eyemask"],
  ["頸枕", "neckPillow"],
];

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "formula"],

    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
  ],
};
export default function EditTravelProject() {
  const {
    setCurerentSavePoint,
    mapRef,
    currentUser,
    dayPlan,
    setDayPlan,
    currentDay,
    setCurrentDay,
  } = usePostData();
  const { id } = useParams();
  const isFirstRender = useRef(true);

  const [isChanging, setIsChanging] = useState(false);
  const [ticketSize, setTicketSize] = useState("big");
  const [quillValue, setQuillValue] = useState("");

  const [prepareList, setPrepareList] = useState([]);
  const [dayPlanPrepareList, setDayPlanPrepareList] = useState(null);

  const [newTicketsContent, setNewTicketsContent] = useState([]);
  const [formInputValue, setFromInputValue] = useState({
    projectName: "",
    country: "",
    date: "",
    endDate: "",
  });
  const { destinationData, setDestinationData } = useDestinationData();

  useEffect(() => {
    //進入頁面後，從firebase拿到資料再set到state裡
    if (!id || !currentUser) return;
    const path = `/users/${currentUser.id}/travelProject/${id}`;

    async function fetchProjectData() {
      const docSnapshot = await getProjectData(path);
      setPrepareList(docSnapshot.prepareList);
      setNewTicketsContent(docSnapshot.tickets);
      setFromInputValue({
        projectName: docSnapshot.projectName,
        country: docSnapshot.country,
        date: docSnapshot.date,
        endDate: docSnapshot.endDate,
      });
      setDestinationData(docSnapshot.destinations);
      setDayPlan(docSnapshot.dayPlan);
    }
    fetchProjectData();

    const dayPlanPath = `/users/${currentUser.id}/travelProject/${id}/dayPlans/day${currentDay}`;
    (async () => {
      const docSnapshot = await getDayPlansData(dayPlanPath);
      setDayPlanPrepareList(docSnapshot.prepareList);
    })();
  }, [currentUser, id]);

  useEffect(() => {
    //接收到更改就上傳更新
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isChanging) return;
    const path = `/users/${currentUser.id}/travelProject/${id}`;
    const dayPlanPath = `/users/${currentUser.id}/travelProject/${id}/dayPlans/day${currentDay}`;
    const data = {
      dayPlan: [...dayPlan],
      destinations: [...destinationData], //會報錯有可能是因為firebase裡面完全沒有叫destinationData的陣列
      tickets: [...newTicketsContent],
      prepareList: [...prepareList],
      projectName: formInputValue.projectName,
      country: formInputValue.country,
      date: formInputValue.date,
      endDate: formInputValue.endDate,
    };
    saveProject(path, data);

    if (dayPlanPrepareList === null) return; //這裡沒用這個擋住會出錯,dayPlanPrepareList is not iterable
    saveDayPlansPrepareList(dayPlanPath, {
      prepareList: [...dayPlanPrepareList],
    });
  }, [
    dayPlan,
    destinationData,
    prepareList,
    newTicketsContent,
    formInputValue,
    isChanging,
    dayPlanPrepareList,
  ]);

  useEffect(() => {
    //偵測目前第幾天，去取得當天的行前清單
    if (dayPlanPrepareList === null) return; //因上面防第一次沒用，所以以null代替
    const dayPlanPath = `/users/${currentUser.id}/travelProject/${id}/dayPlans/day${currentDay}`;
    (async () => {
      const docSnapshot = await getDayPlansData(dayPlanPath);
      setDayPlanPrepareList(docSnapshot.prepareList);
    })();
  }, [currentDay]);

  //Debouce
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChanging(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [formInputValue]);

  const interactWithMarker = (perday) => {
    setCurerentSavePoint(perday);
    console.log(perday);
    mapRef.current.flyTo({
      center: [perday.coordinates[0], perday.coordinates[1]],
      zoom: 8,
    });
  };

  const handleCheckboxChange = (e, item) => {
    const ischecked = e.target.checked;
    if (ischecked) {
      setDayPlanPrepareList((prevList) => [
        ...prevList,
        { id: item[0], isChecked: false },
      ]);
    } else {
      setDayPlanPrepareList((prevlist) =>
        prevlist.filter((each) => each.id !== item[0])
      );
    }
  };

  const handlePreparationBacklog = (e, item) => {
    setDayPlanPrepareList((prevList) => {
      return prevList.map((listItem) => {
        if (listItem.id === item.id) {
          return { ...listItem, isChecked: !listItem.isChecked };
        } else {
          return listItem;
        }
      });
    });
  };

  const handleSetTicketSize = (e) => {
    setTicketSize(e.target.value);
  };

  const saveNewTicket = () => {
    const size = ticketSize === "big" ? "w-full" : "w-[47%]";

    setNewTicketsContent((prevtickets) => [
      ...prevtickets,
      { content: quillValue, size, id: `${quillValue}_${size}` },
    ]);
    setQuillValue("");
  };

  const deleteTicket = (id) => {
    setNewTicketsContent((prevtickets) =>
      prevtickets.filter((eachticket) => eachticket.id !== id)
    );
  };

  const handleChange = (e) => {
    setIsChanging(true);
    const { name, value } = e.target;
    setFromInputValue((prevvalue) => ({
      ...prevvalue,
      [name]: value,
    }));
  };

  const addNewDay = async () => {
    //dayPlan長度等於天數
    const dayCount = dayPlan.length + 1;
    const newDay = `day${dayCount}`;
    setDayPlan((prevdays) => [...prevdays, { [newDay]: [] }]);

    //add new day 就要順便增加dayPlans
    const dayPlanPath = `/users/${currentUser.id}/travelProject/${id}/dayPlans/${newDay}`;
    try {
      await addNewDayPlan(dayPlanPath);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteDay = (day) => {
    //day is a string("day1"),and currentDay is number, so it must switched into srting first
    const currentDayString = currentDay.toString();

    //if currentDay is the day would be deleted, it'll occure "Cannot read properties of undefined (reading 'day5')""
    if (day === "day" + currentDayString) {
      setCurrentDay((prevDay) => prevDay - 1);
    }

    setDayPlan((prevdays) => {
      const daysAfterDelete = prevdays.filter(
        (perday) => Object.keys(perday)[0] !== day
      );
      return daysAfterDelete.map((perday, index) => {
        //perday is object
        const oldKey = Object.keys(perday)[0];
        const newKey = `day${index + 1}`;
        const updatedDay = { [newKey]: perday[oldKey] };
        return updatedDay;
      });
    });
  };

  const handleSetCurrentDay = (day) => {
    const previousDayTab = document.querySelector(`#day${currentDay}`); //移除上一個天數的class
    previousDayTab.classList.remove("tab-active");

    const currentDayTab = document.querySelector(`#day${day}`); //添加當前傳入天數的class
    currentDayTab.classList.add("tab-active");
    setCurrentDay(day);
  };
  return (
    <div className="p-7 flex flex-col flex-1 bg-[#F0F5F9] rounded-b-lg relative">
      <form className="flex flex-col gap-3 border border-slate-500 p-5 rounded-lg bg-[#d0dbe8]">
        <div className="flex flex-col">
          <label
            htmlFor="projectName"
            className="text-[#1E2022] font-light flex items-center text-lg"
          >
            旅行名稱：
            <Pencil size={16} color="#52616B" className="cursor-pointer" />
          </label>
          <input
            type="text"
            placeholder="旅行名稱"
            className="py-1 px-3 outline-none text-[20px] w-full max-w-xs text-[#34373b] bg-transparent transition-all border border-transparent focus:border-[#F0F5F9] focus:text-white focus:bg-[#bfc7d1] rounded-md"
            name="projectName"
            id="projectName"
            maxLength={10}
            defaultValue={formInputValue.projectName}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="country"
            className="text-[#1E2022] font-light flex items-center text-lg"
          >
            旅遊地點：
            <Pencil size={16} color="#52616B" className="cursor-pointer" />
          </label>
          <input
            type="text"
            placeholder="國家或城市"
            className="py-1 px-3 outline-none text-[20px] w-full max-w-xs text-[#34373b] bg-transparent transition-all border border-transparent focus:border-[#F0F5F9] focus:text-white focus:bg-[#bfc7d1] rounded-md"
            name="country"
            id="country"
            maxLength={7}
            defaultValue={formInputValue.country}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="xl:flex-row xl:justify-between sm:flex flex-col gap-3">
          <label htmlFor="date" className="text-[#1E2022] font-light">
            出發日期：
            <input
              type="date"
              className="input input-bordered input-sm  max-w-xs focus:text-black focus:bg-[#e5e5e5] text-[#34373b] bg-transparent"
              name="date"
              id="date"
              defaultValue={formInputValue.date}
              onChange={(e) => handleChange(e)}
            />
          </label>
          <label htmlFor="endDate" className="text-[#1E2022] font-light">
            結束日期：
            <input
              type="date"
              className="input input-bordered input-sm  max-w-xs focus:text-black focus:bg-[#e5e5e5] text-[#34373b] bg-transparent"
              name="endDate"
              id="endDate"
              min={formInputValue.date}
              defaultValue={formInputValue.endDate}
              onChange={(e) => handleChange(e)}
            />
          </label>
        </div>
      </form>
      <div className="flex my-4 items-center gap-3">
        <div role="tablist" className="tabs tabs-lifted mr-auto flex-1">
          {dayPlan?.map(
            (
              perday,
              index //index + 1就是正確的天數
            ) => (
              <React.Fragment key={Object.keys(perday)[0]}>
                <button
                  id={Object.keys(perday)[0]}
                  key={Object.keys(perday)[0]}
                  role="tab"
                  className={`tab [--tab-bg:#d4eaf7] [--tab-border-color:#b6ccd8] text-[#313d44] hover:text-[#ffb703] transition-transform ${
                    currentDay - 1 === index ? "tab-active" : ""
                  }`}
                  onClick={() => handleSetCurrentDay(index + 1)}
                >
                  {Object.keys(perday)[0]}
                </button>
                <button
                  className={`hover:opacity-1 hover:text-[#313d44] ${
                    dayPlan.length === 1 && "hidden" //剩下一天就要隱藏刪除鍵
                  }`}
                  // onClick={() => deleteDay(Object.keys(perday)[0])}
                  onClick={() =>
                    document
                      .getElementById(
                        `deleteDayModal_${Object.keys(perday)[0]}`
                      )
                      .showModal()
                  }
                >
                  刪除
                </button>
                <dialog
                  id={`deleteDayModal_${Object.keys(perday)[0]}`}
                  className="modal"
                >
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">確定要刪除嗎？</h3>
                    <div className="modal-action">
                      <form method="dialog">
                        <button className="btn btn-sm mr-3 bg-[#C9D6DF] border-none  text-[#34373b] hover:text-[#F0F5F9]">
                          取消
                        </button>
                        <button
                          className="btn btn-sm  bg-rose-600 border-none text-[#34373b] hover:text-[#F0F5F9]"
                          onClick={() => deleteDay(Object.keys(perday)[0])}
                        >
                          刪除
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </React.Fragment>
            )
          )}
        </div>
        <button
          className="btn btn-sm px-1 bg-[#C9D6DF] border-[#C9D6DF] ml-2"
          onClick={addNewDay}
        >
          <Plus />
        </button>
      </div>

      <section className="flex flex-wrap my-4 gap-y-6 justify-between">
        <div className=" w-[47%] bg-[#C9D6DF] rounded-2xl min-h-[300px] p-4 shadow-xl relative hover:scale-105 transition-transform">
          <h1 className="text-[32px] text-slate-800 flex items-center gap-2">
            地點 <LandPlot />
          </h1>
          <span className="text-sm leading-[32px] text-[#52616B]">
            （地圖右上角標記工具）
          </span>
          <div className="divider my-1"></div>
          <ul className="menu bg-base-200 w-full rounded-box bg-transparent text-black pl-0">
            {dayPlan[currentDay - 1][`day${currentDay}`]?.map(
              (perday, index) => (
                <li key={perday.id}>
                  <a
                    onClick={() => interactWithMarker(perday)}
                    className="pl-1 hover:ring-1 hover:ring-slate-500"
                  >
                    {`${index + 1}.`}
                    {perday.destination}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
        <div className="w-[47%] bg-[#C9D6DF] rounded-2xl min-h-[300px] p-4 shadow-xl hover:scale-105 transition-transform">
          <h1 className="text-[32px] text-slate-800">行前清單</h1>
          <button
            className="btn btn-sm btn-ghost px-1"
            onClick={() => document.getElementById("prepareList").showModal()}
          >
            <Plus color="#52616B" />
          </button>
          <div className="divider my-1"></div>
          <form className="flex flex-col items-start justify-center gap-2">
            {dayPlanPrepareList?.map((item, index) => (
              <div key={index} className="flex justify-between w-full">
                <label
                  htmlFor={item.id}
                  className="text-black flex items-center"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info mr-2 border-[#1E2022] [--chkbg:#d4eaf7] checked:border-[#d4eaf7]"
                    id={item.id}
                    name={item.id}
                    checked={item.isChecked}
                    onChange={(e) => handlePreparationBacklog(e, item)}
                  />
                  {item.id}
                </label>
              </div>
            ))}
          </form>
        </div>

        {newTicketsContent?.map((perticket, index) => (
          <Ticket
            key={`${perticket.id}_${index}`}
            ticketData={perticket}
            deleteTicket={deleteTicket}
          />
        ))}
      </section>
      <button
        className="btn btn-sm bg-[#C9D6DF] text-[#52616B] border-[#C9D6DF] hover:text-[#F0F5F9] px-1 my-3"
        onClick={() => document.getElementById("newTicketDialog").showModal()}
      >
        新增備註＋
      </button>
      {/* 清單modal */}
      <dialog id="prepareList" className="modal">
        <div className="modal-box max-w-fit bg-[#C9D6DF] border border-2 border-slate-500">
          <form
            id="travelChecklistForm"
            className="flex flex-wrap gap-y-5 w-full"
          >
            <fieldset className="w-1/3 flex flex-col gap-1">
              <legend className="text-xl font-semibold mb-3">證件類</legend>
              {documentItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info border-[#1E2022]"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                    checked={dayPlanPrepareList?.some(
                      (dayPlanitem) => dayPlanitem.id === item[0]
                    )}
                  />
                  <label htmlFor={item[0]}>{item[0]}</label>
                </div>
              ))}
            </fieldset>
            <fieldset className="w-1/3 flex flex-col gap-1">
              <legend className="text-xl font-semibold mb-3">衣物類</legend>
              {clothingItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info border-[#1E2022]"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                    checked={dayPlanPrepareList?.some(
                      (dayPlanitem) => dayPlanitem.id === item[0]
                    )}
                  />
                  <label htmlFor={item[1]}>{item[0]}</label>
                </div>
              ))}
            </fieldset>
            <fieldset className="w-1/3 flex flex-col gap-1">
              <legend className="text-xl font-semibold mb-3">盥洗用品類</legend>
              {toiletryItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info border-[#1E2022]"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                    checked={dayPlanPrepareList?.some(
                      (dayPlanitem) => dayPlanitem.id === item[0]
                    )}
                  />
                  <label htmlFor={item[1]}>{item[0]}</label>
                </div>
              ))}
            </fieldset>
            <fieldset className="w-1/3 flex flex-col gap-1">
              <legend className="text-xl font-semibold mb-3">藥物類</legend>
              {medicineItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info border-[#1E2022]"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                    checked={dayPlanPrepareList?.some(
                      (dayPlanitem) => dayPlanitem.id === item[0]
                    )}
                  />
                  <label htmlFor={item[1]}>{item[0]}</label>
                </div>
              ))}
            </fieldset>
            <fieldset className="w-1/3 flex flex-col gap-1">
              <legend className="text-xl font-semibold mb-3">電器類</legend>
              {electronicItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info border-[#1E2022]"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                    checked={dayPlanPrepareList?.some(
                      (dayPlanitem) => dayPlanitem.id === item[0]
                    )}
                  />
                  <label htmlFor={item[1]}>{item[0]}</label>
                </div>
              ))}
            </fieldset>
            <fieldset className="w-1/3 flex flex-col gap-1">
              <legend className="text-xl font-semibold mb-3">日用品</legend>
              {dailyItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info border-[#1E2022]"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                    checked={dayPlanPrepareList?.some(
                      (dayPlanitem) => dayPlanitem.id === item[0]
                    )}
                  />
                  <label htmlFor={item[1]}>{item[0]}</label>
                </div>
              ))}
            </fieldset>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {/* 編輯新清單dialog */}
      <dialog id="newTicketDialog" className="modal">
        <div className="modal-box bg-[#C9D6DF] border border-2 border-slate-500">
          <div className="flex gap-4 mb-3">
            <label htmlFor="ticket_big" className="flex items-center">
              <span>大</span>
              <StickyNote size={28} strokeWidth={1} />
              <input
                type="radio"
                name="ticket_size"
                id="ticket_big"
                className="radio"
                value="big"
                checked={ticketSize === "big"}
                onChange={(e) => handleSetTicketSize(e)}
              />
            </label>
            <label htmlFor="ticket_small" className="flex items-center">
              <span>小</span>
              <StickyNote size={20} strokeWidth={1} />
              <input
                type="radio"
                name="ticket_size"
                id="ticket_small"
                value="small"
                className="radio"
                checked={ticketSize === "small"}
                onChange={(e) => handleSetTicketSize(e)}
              />
            </label>
          </div>
          <ReactQuill
            theme="snow"
            modules={modules}
            value={quillValue}
            onChange={setQuillValue}
          />
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm mr-4" onClick={saveNewTicket}>
                儲存
              </button>
              <button className="btn btn-sm">取消</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function Ticket({ ticketData, deleteTicket }) {
  return (
    <div
      className={
        ticketData.size +
        " bg-[#C9D6DF] rounded-2xl min-h-[300px] p-4 shadow-xl relative hover:scale-105 transition-transform"
      }
    >
      <button
        className="btn btn-sm px-1 absolute top-2 right-2 bg-transparent border-none"
        onClick={() => deleteTicket(ticketData.id)}
      >
        <Trash2 />
      </button>
      <div
        dangerouslySetInnerHTML={{ __html: ticketData.content }}
        className="quillValueContainer break-words text-black"
      ></div>
    </div>
  );
}
