import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";

function Canvas() {
  const canvasRef = useRef(null);
  const canvas = useRef(null);
  const [textColor, setTextColor] = useState("#000000");

  useEffect(() => {
    canvas.current = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 400,
    });

    canvas.current.on("selection:created", handleObjectSelected);

    return () => {
      canvas.current.off("selection:created", handleObjectSelected);
      canvas.current.dispose();
    };
  }, []);

  const handleObjectSelected = (e) => {
    const selectedObj = canvas.current.getActiveObject();
    if (selectedObj && selectedObj.type === "textbox") {
      selectedObj.set({ fill: textColor });
      canvas.current.requestRenderAll();
    }
  };

  const addTextBox = () => {
    const textBox = new fabric.Textbox("點擊兩次以編輯", {
      left: 50,
      top: 50,
      width: 200,
      fontSize: 30,
      borderColor: "black",
      editingBorderColor: "blue",
      transparentCorners: false, // 啟用控制點
      cornerColor: "blue", // 控制點顏色
      fill: textColor,
    });

    // 設置可編輯和可移動
    textBox.set({
      editable: true,
      moveable: true,
    });

    canvas.current.add(textBox);
    canvas.current.setActiveObject(textBox); // 渲染控制點
    textBox.enterEditing(); // 啟用編輯模式

    // 添加事件監聽器以在編輯時更新文本
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

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={400} className="border" />
      <button onClick={addTextBox}>添加文字框</button>
      <input type="file" onChange={handleFileChange} />
      <input
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
      />
    </div>
  );
}

export default Canvas;
