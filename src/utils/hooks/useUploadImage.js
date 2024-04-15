import { useCallback, useState } from "react";
import uploadFetch from "./uploadFetch";

const useUpload = (options) => {
  const {
    maxUploadFileAmount = Infinity,
    overMaxUploadFileMessage,
    onSetFiles,
  } = options;
  const [fileList, setFiles] = useState(null);

  const handlePushFileList = useCallback((_files) => {
    setFiles((files) => {
      if (!files) {
        return _files;
      } else {
        return [...files, ..._files];
      }
    });
  }, []);

  const handleAddFiles = useCallback(
    (_files) => {
      const fileListAmount = fileList ? fileList.length : 0;
      const isOverUploadLimit =
        _files.length + fileListAmount > maxUploadFileAmount;

      if (isOverUploadLimit) {
        window.alert(overMaxUploadFileMessage);
      } else {
        handlePushFileList(_files);
        onSetFiles && onSetFiles(_files);
      }
    },
    [
      fileList,
      handlePushFileList,
      maxUploadFileAmount,
      onSetFiles,
      overMaxUploadFileMessage,
    ]
  );

  const handleChangeFiles = useCallback(
    (e) => {
      const { files } = e.target;
      if (files) {
        handleAddFiles(files);
      }
    },
    [handleAddFiles]
  );

  const handleUpload = useCallback(
    (request) =>
      uploadFetch({
        ...options,
        request,
      }),
    [options]
  );

  return {
    fileList,
    setFiles,
    handleAddFiles,
    handleChangeFiles,
    handleUpload,
  };
};

export default useUpload;
