const readFileList = (onSetPreviewFile) => (fileList) => {
  if (fileList && fileList.length > 0) {
    for (const _file of fileList) {
      const reader = new FileReader();
      const fileName = _file.name;

      reader.onload = (e) => {
        if (e.target) {
          onSetPreviewFile({
            src: e.target.result,
            name: fileName,
          });
        }
      };
      reader.readAsDataURL(_file);
    }
  }
};

export default readFileList;
