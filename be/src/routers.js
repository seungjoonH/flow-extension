import path from "node:path";
import express from "express";
import { sendOk, sendCreated } from "#src/response/send";
import {
  deleteExtsCustom,
  getExts,
  patchExtsFixed,
  postExtsCustom,
} from "#src/service";

const router = express.Router();

const BASE = "/api/exts";

const extsPath = (...segments) => path.posix.join(BASE, ...segments);


router.get(extsPath(), (_req, res) => {
  const data = getExts();
  sendOk(res, data);
});

router.post(extsPath("custom"), (req, res) => {
  const data = postExtsCustom(req.body);
  sendCreated(res, data);
});

router.patch(extsPath("fixed", ":name"), (req, res) => {
  const data = patchExtsFixed(req.params.name, req.body);
  sendOk(res, data);
});

router.delete(extsPath("custom", ":name"), (req, res) => {
  const data = deleteExtsCustom(req.params.name);
  sendOk(res, data);
});

export default router;
