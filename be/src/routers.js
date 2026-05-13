import path from "node:path";
import express from "express";
import { sendCreated, sendOk } from "#src/response/send";
import service from "#src/service";

const router = express.Router();

const BASE = "/api/exts";

const extsPath = (...segments) => path.posix.join(BASE, ...segments);


router.get(extsPath(), (_req, res) => {
  sendOk(res, service.getExts());
});

router.post(extsPath("custom"), (req, res) => {
  sendCreated(res, service.postExtsCustom(req.body));
});

router.patch(extsPath("fixed", ":name"), (req, res) => {
  sendOk(res, service.patchExtsFixed(req.params.name, req.body));
});

router.delete(extsPath("custom", ":name"), (req, res) => {
  sendOk(res, service.deleteExtsCustom(req.params.name));
});

export default router;
