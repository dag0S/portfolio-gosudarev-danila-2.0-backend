import { Router } from "express";
import multer from "multer";
import { v4 as uuidV4 } from "uuid";

import { uploadFile } from "../controllers/tests";
import { yandexDiskApi } from "../api/yandexDiskApi";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToYandexDisk = async (
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
    console.log(uploadFile);

    const res = await yandexDiskApi.put(uploadUrl, fileBuffer, {
      headers: { "Content-Type": mimeType },
    });

    console.log(res);
  } catch (error) {
    console.error("Ошибка загрузки на Яндекс.Диск:", error);
    throw error;
  }
};

const getYandexDiskFileUrl = async (path: string): Promise<string> => {
  const response = await yandexDiskApi.get(
    "https://cloud-api.yandex.net/v1/disk/resources",
    {
      params: { path },
    }
  );
  console.log(response);
  return response.data.file;
};

// /api/tests/upload
router.post(
  "/upload",
  upload.single("file"),
  async (req, res): Promise<any> => {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не был загружен" });
    }
    const { buffer, originalname, mimetype } = req.file;
    const uploadPath = `lib_space/books/${uuidV4()}_${originalname}`;

    await uploadToYandexDisk(uploadPath, buffer, mimetype);

    let coverUrl = await getYandexDiskFileUrl(uploadPath);

    res.status(200).json({
      url: coverUrl,
    });
  }
);

export default router;
