export const changeExtension = (file: string, ext: string) => {
  let pos = file.lastIndexOf(".");
  return file.substring(0, pos < 0 ? file.length : pos) + `.${ext}`;
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export function getExtension(filename: string) {
  return filename.split(".").pop();
}

export function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
}

export function addExtension(file: string, extension: string) {
  return `${file}.${extension}`;
}

export function parseFileName(fileName: string) {
  const extension = getExtension(fileName);
  return addExtension(
    fileName.split("-").slice(0, -1).join("-"),
    extension || "png"
  );
}
