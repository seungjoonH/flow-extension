import path from "node:path";
import express from "express";
import { sendOk, sendCreated } from "#src/response/send";
import * as service from "#src/service";

const router = express.Router();

const BASE = "/api/exts";

const extsPath = (...segments) => path.posix.join(BASE, ...segments);


// GET /api/exts
router.get(extsPath(), (_req, res) => {
  const data = service.getExts();
  sendOk(res, data);
});

// POST /api/exts/custom
router.post(extsPath("custom"), (req, res) => {
  const data = service.postExtsCustom(req.body);
  sendCreated(res, data);
});

// PATCH /api/exts/fixed/:name
router.patch(extsPath("fixed", ":name"), (req, res) => {
  const data = service.patchExtsFixed(req.params.name, req.body);
  sendOk(res, data);
});

// DELETE /api/exts/custom
router.delete(extsPath("custom"), (_req, res) => {
  const data = service.deleteExtsCustomAll();
  sendOk(res, data);
});

// DELETE /api/exts/custom/:name
router.delete(extsPath("custom", ":name"), (req, res) => {
  const data = service.deleteExtsCustom(req.params.name);
  sendOk(res, data);
});

export default router;
