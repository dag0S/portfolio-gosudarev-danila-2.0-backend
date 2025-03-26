import axios from "axios";

export const yandexDiskApi = axios.create({
  baseURL: `${process.env.YANDEX_DISK_API_URL}`,
  headers: {
    Authorization: `OAuth ${process.env.YANDEX_OAUTH_TOKEN}`,
  },
});

export const uploadToYandexDisk = async (
  path: string,
  fileBuffer: Buffer,
  mimeType: string
) => {
  try {
    const uploadUrlResponse = await yandexDiskApi.get(
      "/v1/disk/resources/upload",
      {
        params: { path, overwrite: "true" },
      }
    );

    const uploadUrl = uploadUrlResponse.data.href;

    await yandexDiskApi.put(uploadUrl, fileBuffer, {
      headers: { "Content-Type": mimeType },
    });
  } catch (error) {
    console.error("Ошибка загрузки на Яндекс.Диск:", error);
    throw error;
  }
};

export const getYandexDiskFileUrl = async (path: string): Promise<string> => {
  const response = await yandexDiskApi.get(
    "https://cloud-api.yandex.net/v1/disk/resources",
    {
      params: { path },
    }
  );

  return response.data.file;
};
