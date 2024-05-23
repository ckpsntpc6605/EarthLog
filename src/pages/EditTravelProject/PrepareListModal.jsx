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

const clothingItems = [
  ["貼身衣物", "underwear"],
  ["外衣外褲", "outerwear"],
  ["襪子", "socks"],
  ["鞋子", "shoes"],
];

const toiletryItems = [
  ["牙刷", "toothbrush"],
  ["牙膏", "toothpaste"],
  ["洗面乳", "facialCleanser"],
  ["沐浴乳", "bodyWash"],
  ["洗髮精", "shampoo"],
  ["卸妝水", "makeupRemover"],
];

const medicineItems = [
  ["暈機藥", "motionSicknessMedication"],
  ["頭痛藥", "headacheMedication"],
  ["感冒藥", "coldMedication"],
  ["止痛藥", "painReliefMedication"],
  ["個人藥品", "personalMedication"],
];

const electronicItems = [
  ["充電器", "charger"],
  ["萬能轉接頭", "universalAdapter"],
  ["行動電源", "powerBank"],
  ["相機", "camera"],
  ["耳機", "earphones"],
  ["記憶卡", "memoryCard"],
  ["網卡", "networkCard"],
];
const dailyItems = [
  ["隨身酒精瓶", "travelSizeAlcoholBottle"],
  ["防竊小包", "antiTheftPouch"],
  ["護手霜", "handCream"],
  ["眼罩", "eyemask"],
  ["頸枕", "neckPillow"],
];

export default function PrepareListModal({
  handleCheckboxChange,
  dayPlanPrepareList,
}) {
  return (
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
  );
}
