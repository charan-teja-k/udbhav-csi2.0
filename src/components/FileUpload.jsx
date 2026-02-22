const CLOUD_NAME = "dh5gqlgi2";
const UPLOAD_PRESET = "pdf_ppt_upload";

/**
 * Uploads a file to Cloudinary.
 * @param {File} file - The file to upload (PDF).
 * @param {string} teamName - Used as the public_id (file name) on Cloudinary.
 * @param {function(number): void} [onProgress] - Optional progress callback (0–100).
 * @returns {Promise<string>} Resolves with the uploaded file's secure URL.
 */
export function uploadToCloudinary(file, teamName, onProgress) {
  return new Promise((resolve, reject) => {
    const sanitized = teamName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_\-]/g, "");

    const data = new FormData();
    const renamedFile = new File([file], `${sanitized}.pdf`, { type: file.type });
    data.append("file", renamedFile);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("public_id", `ppt_submissions/${sanitized}`);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      let result;
      try {
        result = JSON.parse(xhr.responseText);
      } catch {
        reject(new Error("Invalid response"));
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        if (result.secure_url) {
          const downloadUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');
          resolve(downloadUrl);
        } else {
          reject(new Error(result.error?.message || "Upload failed: no URL returned."));
        }
      } else {
        reject(new Error(result.error?.message || `Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
    xhr.addEventListener("abort", () => reject(new Error("Upload was aborted.")));

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`);
    xhr.send(data);
  });
}

// Default export kept for backward compatibility
function FileUpload() {
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadToCloudinary(file, file.name);
      console.log("Uploaded file URL:", url);
      alert("Upload successful!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <input
      type="file"
      accept=".pdf,.ppt,.pptx"
      onChange={handleChange}
    />
  );
}

export default FileUpload;
