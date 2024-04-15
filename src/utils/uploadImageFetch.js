const uploadImageFetch = ({
  uploadApiUrl,
  request,
  onUploadSuccess,
  onUploadFailed,
  onBeforeUploadCheck,
}) => {
  const fetchFn = () => {
    return fetch(uploadApiUrl, request)
      .then((res) => res.json())
      .then((res) => {
        if (!res.error) {
          onUploadSuccess && onUploadSuccess(res);
        } else {
          onUploadFailed && onUploadFailed(res);
        }
        return res;
      })
      .catch((e) => {
        onUploadFailed && onUploadFailed(e);
      });
  };

  if (onBeforeUploadCheck) {
    if (onBeforeUploadCheck()) {
      return fetchFn();
    }
  } else {
    return fetchFn();
  }
};

export default uploadImageFetch;
