import { useCallback, useState } from "react";

const usePreviewImages = () => {
  const [previewFileList, setPreviewFiles] = useState([]);

  const handleAddPreviewFiles = useCallback((previewFile) => {
    setPreviewFiles((f) => [...f, previewFile]);
  }, []);

  return {
    previewFileList,
    setPreviewFiles,
    handleAddPreviewFiles,
  };
};

export default usePreviewImages;
