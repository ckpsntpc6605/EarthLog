import React, { useState, useRef } from "react";
import { Stage, Layer, Transformer, Text } from "react-konva";

const TextBoxEditor = () => {
  const [textboxes, setTextboxes] = useState([]);
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const [isTransforming, setIsTransforming] = useState(false);
  const transformerRef = useRef(null);
  const selectedTextboxRef = useRef(null);

  const handleAddTextbox = () => {
    const newTextbox = {
      x: 50,
      y: 50,
      text: "Double click to edit",
      color: textColor,
      fontSize,
    };
    setTextboxes([...textboxes, newTextbox]);
  };

  const handleTextboxTransform = (node) => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    transformerRef.current.setNode(node);
    transformerRef.current.getLayer().batchDraw();
    node.setAttrs({
      scaleX,
      scaleY,
    });

    // 進入編輯模式
    node.startEditing();
  };

  const handleTransformStart = () => {
    setIsTransforming(true);
  };

  const handleTransformEnd = () => {
    setIsTransforming(false);
    transformerRef.current.getNode().setAttrs({
      text: selectedTextboxRef.current.textContent,
    });
    transformerRef.current.detachFrom(transformerRef.current.getNode());
    transformerRef.current.getLayer().batchDraw();
  };

  return (
    <div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {textboxes.map((textbox, index) => (
            <Text
              key={index}
              x={textbox.x}
              y={textbox.y}
              text={textbox.text}
              fill={textbox.color}
              fontSize={textbox.fontSize}
              readonly={false}
              draggable
              onClick={() => handleTextboxTransform(textbox)}
              onDblClick={() => handleTextboxTransform(textbox)}
              onTransformStart={handleTransformStart}
              onTransformEnd={handleTransformEnd}
              onDragEnd={(e) => {
                const node = e.target;
                if (!node.isEditing()) {
                  node.setAttrs({
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }
              }}
              ref={(node) => {
                if (isTransforming) {
                  selectedTextboxRef.current = node;
                }
              }}
            />
          ))}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
      <button onClick={handleAddTextbox}>Add Textbox</button>
      <input
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
      />
      <input
        type="number"
        value={fontSize}
        onChange={(e) => setFontSize(parseInt(e.target.value))}
      />
    </div>
  );
};

export default TextBoxEditor;
