import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { usePostData } from "../../context/dataContext";
import ReactQuill from "react-quill";
import { StickyNote, Trash2, Plus, LandPlot } from "lucide-react";
import { saveProject, getProjectData } from "../../utils/firebase";

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
    destinationData,
    setDestinationData,
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
  const [newTicketsContent, setNewTicketsContent] = useState([]);
  const [formInputValue, setFromInputValue] = useState({
    projectName: "",
    country: "",
    date: "",
  });

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
      });
      setDestinationData(docSnapshot.destinations);
      setDayPlan(docSnapshot.dayPlan);
    }
    fetchProjectData();
  }, [currentUser, id]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isChanging) return;
    const path = `/users/${currentUser.id}/travelProject/${id}`;
    const data = {
      dayPlan: [...dayPlan],
      destinations: [...destinationData], //會報錯有可能是因為firebase裡面完全沒有叫destinationData的陣列
      tickets: [...newTicketsContent],
      prepareList: [...prepareList],
      projectName: formInputValue.projectName,
      country: formInputValue.country,
      date: formInputValue.date,
    };
    saveProject(path, data);
  }, [
    dayPlan,
    destinationData,
    prepareList,
    newTicketsContent,
    formInputValue,
    isChanging,
  ]);

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
      setPrepareList((prevlist) => [
        ...prevlist,
        { id: item[0], isChecked: false },
      ]);
    } else {
      setPrepareList((prevlist) =>
        prevlist.filter((each) => each.id !== item[0])
      );
    }
  };

  const handlePreparationBacklog = (e, item) => {
    setPrepareList((prevList) => {
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

  const addNewDay = () => {
    //dayPlan長度等於天數
    const dayCount = dayPlan.length + 1;
    const newDay = `day${dayCount}`;
    setDayPlan((prevdays) => [...prevdays, { [newDay]: [] }]);
  };

  const deleteDay = (day) => {
    setDayPlan((prevdays) => {
      const daysAfterDelete = prevdays.filter(
        (perday) => Object.keys(perday)[0] !== day
      );
      return daysAfterDelete.map((perday, index) => {
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
  //記錄目前選到第幾天記錄目前選到第幾天記錄目前選到第幾天記錄目前選到第幾天記錄目前選到第幾天記錄目前選到第幾天記錄目前選到第幾天記錄目前選到第幾天記錄目前選到第幾天記錄目前選到第幾天記錄目前選到第幾天

  return (
    <div className="p-3 flex-1 bg-[#2b2d42] rounded-b-lg relative">
      <form
        action=""
        className="flex flex-col gap-2 border border-slate-400 p-2 rounded-lg bg-[rgba(0,0,0,.5)]"
      >
        <div className="flex flex-col">
          <label htmlFor="projectName" className="text-slate-500 font-light">
            旅行名稱：
          </label>
          <input
            type="text"
            placeholder="旅行名稱"
            className="input input-bordered input-sm px-0 text-[20px] w-full max-w-xs focus:border-white focus:px-2 focus:bg-[#003049] text-white bg-transparent transition-all"
            name="projectName"
            id="projectName"
            defaultValue={formInputValue.projectName}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="country" className="text-slate-500 font-light">
            旅遊地點：
          </label>
          <input
            type="text"
            placeholder="國家或城市"
            className="input input-bordered input-sm px-0 text-[20px] w-full max-w-xs focus:border focus:border-white focus:text-white focus:px-2 focus:bg-[#003049] text-white bg-transparent transition-all"
            name="country"
            id="country"
            defaultValue={formInputValue.country}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <label htmlFor="date" className="text-slate-500 font-light">
          日期：
          <input
            type="date"
            className="input input-bordered input-sm  max-w-xs focus:text-black focus:bg-[#e5e5e5] text-white bg-transparent"
            name="date"
            id="date"
            defaultValue={formInputValue.date}
            onChange={(e) => handleChange(e)}
          />
        </label>
      </form>
      <div className="flex my-4 items-center gap-3">
        <div role="tablist" className="tabs tabs-lifted mr-auto flex-1">
          {dayPlan?.map(
            (
              perday,
              index //index + 1就是正確的天數
            ) => (
              <>
                <button
                  id={Object.keys(perday)[0]}
                  key={Object.keys(perday)[0]}
                  role="tab"
                  className="tab text-slate-400 hover:text-[#ffb703] transition-transform"
                  onClick={() => handleSetCurrentDay(index + 1)}
                >
                  {Object.keys(perday)[0]}
                </button>
                <button
                  className="hover:opacity-1 hover:text-white"
                  onClick={() => deleteDay(Object.keys(perday)[0])}
                >
                  刪除
                </button>
              </>
            )
          )}
        </div>
        <button className="btn btn-sm px-1" onClick={addNewDay}>
          <Plus />
        </button>
      </div>

      <section className="flex flex-wrap my-4 gap-3 items-start justify-between">
        <div className="w-[47%] bg-[rgb(165,217,255)] rounded-2xl min-h-[300px] p-4 shadow-xl relative hover:scale-105 transition-transform">
          <h1 className="text-[32px] text-slate-800 flex items-center gap-2">
            地點 <LandPlot />
          </h1>

          <ul className="menu bg-base-200 w-full rounded-box bg-transparent text-black pl-0">
            {dayPlan[currentDay - 1][`day${currentDay}`]?.map((perday) => (
              <li key={perday.id}>
                <a
                  onClick={() => interactWithMarker(perday)}
                  className="pl-1 hover:ring-1 hover:ring-slate-500"
                >
                  {perday.destination}
                </a>
              </li>
            ))}
          </ul>
          {/* {destinationData?.map((eachdata, index) => (
            <ul
              className="menu bg-base-200 w-full rounded-box mb-2 bg-transparent text-black pl-0"
              key={index}
            >
              <li>
                <a
                  onClick={() => interactWithMarker(eachdata.coordinates)}
                  className="pl-0"
                >
                  {eachdata.destination}
                </a>
              </li>
            </ul>
          ))} */}
        </div>
        <div className="w-[47%] bg-[rgb(165,217,255)] rounded-2xl min-h-[300px] p-4 shadow-xl hover:scale-105 transition-transform">
          <h1 className="text-[32px] text-slate-800">行前清單</h1>
          <button
            className="btn btn-sm btn-ghost px-1"
            onClick={() => document.getElementById("prepareList").showModal()}
          >
            <Plus />
          </button>
          <form action="">
            {prepareList?.map((item, index) => (
              <React.Fragment key={index}>
                <input
                  type="checkbox"
                  className="checkbox checkbox-warning "
                  id={item.id}
                  name={item.id}
                  checked={item.isChecked}
                  onChange={(e) => handlePreparationBacklog(e, item)}
                />
                <label for={item.id} className="text-black">
                  {item.id}
                </label>
                <br />
              </React.Fragment>
            ))}
          </form>
        </div>

        {newTicketsContent?.map((perticket) => (
          <Ticket
            key={perticket.id}
            ticketData={perticket}
            deleteTicket={deleteTicket}
          />
        ))}
        <button
          className="btn btn-sm  px-1 my-3"
          onClick={() => document.getElementById("newTicketDialog").showModal()}
        >
          add tickets
        </button>
      </section>
      {/* 清單modal */}
      <dialog id="prepareList" className="modal">
        <div className="modal-box bg-yellow-100">
          <form id="travelChecklistForm" className="flex flex-wrap gap-5">
            <fieldset>
              <legend className="text-xl font-semibold">證件類</legend>
              {documentItems.map((item, index) => (
                <React.Fragment key={index}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-warning"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                  />
                  <label for={item[1]}>{item[0]}</label>
                  <br />
                </React.Fragment>
              ))}
            </fieldset>
            <fieldset>
              <legend className="text-xl font-semibold">衣物類</legend>
              {clothingItems.map((item, index) => (
                <React.Fragment key={index}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-warning"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                  />
                  <label for={item[1]}>{item[0]}</label>
                  <br />
                </React.Fragment>
              ))}
            </fieldset>
            <fieldset>
              <legend className="text-xl font-semibold">盥洗用品類</legend>
              {toiletryItems.map((item, index) => (
                <React.Fragment key={index}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-warning"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                  />
                  <label for={item[1]}>{item[0]}</label>
                  <br />
                </React.Fragment>
              ))}
            </fieldset>
            <fieldset>
              <legend className="text-xl font-semibold">藥物類</legend>
              {medicineItems.map((item, index) => (
                <React.Fragment key={index}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-warning"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                  />
                  <label for={item[1]}>{item[0]}</label>
                  <br />
                </React.Fragment>
              ))}
            </fieldset>
            <fieldset>
              <legend className="text-xl font-semibold">電器類</legend>
              {electronicItems.map((item, index) => (
                <React.Fragment key={index}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-warning"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                  />
                  <label for={item[1]}>{item[0]}</label>
                  <br />
                </React.Fragment>
              ))}
            </fieldset>
            <fieldset>
              <legend className="text-xl font-semibold">日用品</legend>
              {dailyItems.map((item, index) => (
                <React.Fragment key={index}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-warning"
                    id={item[1]}
                    name={item[1]}
                    onChange={(e) => handleCheckboxChange(e, item)}
                  />
                  <label for={item[1]}>{item[0]}</label>
                  <br />
                </React.Fragment>
              ))}
            </fieldset>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {/* 編輯新清單dialog */}
      <dialog id="newTicketDialog" className="modal ">
        <div className="modal-box bg-yellow-200">
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
                ckecked
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
              <button className="btn" onClick={saveNewTicket}>
                儲存
              </button>
              <button className="btn">取消</button>
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
        " bg-[rgb(165,217,255)] rounded-2xl min-h-[300px] p-4 shadow-xl relative hover:scale-105 transition-transform"
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
        className="quillValueContainer break-words text-black" //字的overflow要調字的overflow要調字的overflow要調字的overflow要調字的overflow要調字的overflow要調字的overflow要調字的overflow要調字的overflow要調字的overflow要調
      ></div>
    </div>
  );
}
