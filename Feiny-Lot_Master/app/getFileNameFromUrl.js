function getFileNameFromUrl(url) {
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/[?&]filepath=([^&]+)/);

    let fileName = match && match[1]
      ? match[1]
      : decodedUrl.split("/").pop();

    fileName = fileName || "Download File";

    fileName = fileName.replace(/^\d+_/, "");

    return fileName;
  } catch (e) {
    return "Download File";
  }
}