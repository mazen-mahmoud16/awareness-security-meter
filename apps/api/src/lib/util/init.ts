import fs from "fs";
import { join } from "path";
import AdminModel from "../../models/admin";

const folders = ["videos", "images", "videoThumbnails", "temp"];

async function init() {
  const adminCount = await AdminModel.count();
  if (adminCount === 0) {
    try {
      console.log("[*] Found 0 Admins in the Database");
      await AdminModel.create({
        email: process.env.DEFAULT_ADMIN!,
        password: process.env.DEFAULT_PASS!,
      });
      console.log("[*] Created Default Admin: " + process.env.DEFAULT_ADMIN);
    } catch (e) {
      console.log("[***] Failed to create Default Admin");
    }
  }
  if (!fs.existsSync(process.env.PUBLIC_FOLDER!)) {
    console.log("[*] Creating Public Folder");
    fs.mkdirSync(process.env.PUBLIC_FOLDER!, { recursive: true });
  }
  for (var i = 0; i < folders.length; i++) {
    if (!fs.existsSync(join(process.env.PUBLIC_FOLDER!, folders[i]))) {
      console.log(`[*] Creating ${folders[i]} Folder`);
      fs.mkdirSync(join(process.env.PUBLIC_FOLDER!, folders[i]));
    }
  }

  console.log("[*] Initialization Complete");
}

export default init;
