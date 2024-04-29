import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";

import { PaintBucket } from "lucide-react";

function Canvas({ handleShowCanvas, setCanvasImg, setCanvasJson, canvasImg }) {
  const canvasRef = useRef(null);
  const canvas = useRef(null);
  const [currentFontSize, setCurrentFontSize] = useState(30);
  const [currentObject, setCurrentObject] = useState(null);
  const [currentFontColor, setCurrentFontColor] = useState("#000000");
  const [canvasBgColor, setCanvasBgColor] = useState("#ffffff");

  useEffect(() => {
    canvas.current = new fabric.Canvas(canvasRef.current, {
      width: 464,
      height: 500,
    });

    canvas.current.on("selection:created", handleObjectSelected);
    canvas.current.on("selection:updated", handleSelectionUpdated);

    return () => {
      canvas.current.off("selection:created", handleObjectSelected);
      canvas.current.off("selection:updated", handleSelectionUpdated);
      canvas.current.dispose();
    };
  }, []);
  const handleObjectSelected = (e) => {
    const selectedObj = canvas.current.getActiveObject();
    setCurrentObject(selectedObj);
    console.log(selectedObj);
    if (selectedObj && selectedObj.type === "textbox") {
      setCurrentFontSize(selectedObj.fontSize);
      setCurrentFontColor(selectedObj.fill);
    }
  };
  const handleSelectionUpdated = () => {
    const selectedObj = canvas.current.getActiveObject();
    setCurrentObject(selectedObj);
    if (selectedObj && selectedObj.type === "textbox") {
      setCurrentFontSize(selectedObj.fontSize);
      setCurrentFontColor(selectedObj.fill);
    }
  };

  const addTextBox = () => {
    const textBox = new fabric.Textbox("點擊兩次以編輯", {
      left: 50,
      top: 50,
      width: 200,
      borderColor: "black",
      editingBorderColor: "blue",
      transparentCorners: false, // 啟用控制點
      cornerColor: "blue", // 控制點顏色
    });

    // 設置可編輯和可移動
    textBox.set({
      editable: true,
      moveable: true,
    });

    canvas.current.add(textBox);
    canvas.current.setActiveObject(textBox); // 渲染控制點
    textBox.enterEditing(); // 啟用編輯模式

    textBox.on("changed", () => {
      canvas.current.requestRenderAll();
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const fabricImage = new fabric.Image(img, {
          left: 100, // 初始位置的 x 坐標
          top: 100, // 初始位置的 y 坐標
        });
        canvas.current.add(fabricImage);
        canvas.current.renderAll();
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSetFontSize = (e) => {
    setCurrentFontSize(e.target.value);
    currentObject.set({ fontSize: e.target.value });
    canvas.current.requestRenderAll();
  };
  const handleChangeFontColor = (e) => {
    setCurrentFontColor(e.target.value);
    currentObject.set({ fill: e.target.value });
    canvas.current.requestRenderAll();
  };
  const removeSelectedObject = () => {
    if (currentObject) {
      canvas.current.remove(currentObject);
      canvas.current.renderAll();
      setCurrentObject(null);
    }
  };
  const handleChangeFontWeight = () => {
    if (currentObject && currentObject.type === "textbox") {
      const newFontWeight =
        currentObject.fontWeight === "bold" ? "normal" : "bold";
      currentObject.set({ fontWeight: newFontWeight });
      canvas.current.requestRenderAll();
    }
  };

  const saveAsJSONandSVG = () => {
    canvas.current.backgroundColor = canvasBgColor;
    canvas.current.renderAll();
    const svg = canvas.current.toSVG();
    const cleanSvg = svg
      .replace(/^<\?xml.*\?>\n/, "")
      .replace(/<!DOCTYPE.*\n/, "")
      .trim();
    const json = JSON.stringify(canvas.current.toJSON());
    const imageData = canvas.current.toDataURL({
      format: "png",
      multiplier: 1,
      quality: 1,
    });
    setCanvasJson(json);
    setCanvasImg((prevImg) => [...prevImg, imageData]);
  };

  useEffect(() => {
    canvas.current.clear();
    // handleShowCanvas();
  }, [canvasImg]);

  const leaveEditMode = () => {
    canvas.current.clear();
    setIsEditMode(false);
  };
  return (
    <div
      className={`bg-yellow-200 w-full relative flex flex-col items-center p-5 rounded-lg`}
    >
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-1 top-1"
        onClick={handleShowCanvas}
      >
        ✕
      </button>
      <div className="flex items-center space-x-2 mb-3">
        <button onClick={addTextBox}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="lucide lucide-type"
          >
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" x2="15" y1="20" y2="20" />
            <line x1="12" x2="12" y1="4" y2="20" />
          </svg>
        </button>
        <button onClick={handleChangeFontWeight}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="lucide lucide-bold"
          >
            <path d="M14 12a4 4 0 0 0 0-8H6v8" />
            <path d="M15 20a4 4 0 0 0 0-8H6v8Z" />
          </svg>
        </button>
        <label htmlFor="imageInput" className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="lucide lucide-image"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          id="imageInput"
          className="hidden"
        />
        <input
          type="number"
          className="w-[50px]"
          value={currentFontSize}
          onChange={(e) => handleSetFontSize(e)}
          placeholder="字體大小"
        />
        <input
          type="color"
          className="border-none w-[30px] "
          value={currentFontColor}
          onChange={(e) => handleChangeFontColor(e)}
        />
        <button onClick={removeSelectedObject}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="lucide lucide-trash-2"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </button>
        <button>
          <input
            id="canvasBGColor"
            type="color"
            className="opacity-0 absolute w-1"
            defaultValue={"#ffffff"}
            onChange={(e) => {
              setCanvasBgColor(e.target.value);
              canvas.current.backgroundColor = e.target.value;
              canvas.current.renderAll();
            }}
          />
          <label htmlFor="canvasBGColor">
            <PaintBucket />
          </label>
        </button>
        <button onClick={saveAsJSONandSVG}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="lucide lucide-book-marked"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            <polyline points="10 2 10 10 13 7 16 10 16 2" />
          </svg>
        </button>
        <button onClick={leaveEditMode}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="lucide lucide-chevron-left"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>
      <canvas ref={canvasRef} className="border" />
    </div>
  );
}

export default Canvas;

{
  /* <>
<div className="flex items-center space-x-2">
  <button onClick={onEdit}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      class="lucide lucide-pencil"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  </button>
</div>
<div dangerouslySetInnerHTML={{ __html: SVG }} />
</> */
}
