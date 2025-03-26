import { supabase } from "./supabaseClient";

// Upload file to Supabase storage
export const uploadFile = async (bucketName, filePath, file) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Download file from Supabase storage
export const downloadFile = async (bucketName, filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

// Get public URL for a file
export const getPublicUrl = (bucketName, filePath) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  return data.publicUrl;
};

// List all files in a bucket or folder
export const listFiles = async (bucketName, folderPath = "") => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

// Delete file from storage
export const deleteFile = async (bucketName, filePaths) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove(filePaths);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
