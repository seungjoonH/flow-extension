import express from "express";
import request from "supertest";
import router from "#src/routers";
import { NotFoundError } from "#src/response/error";
import { sendError } from "#src/response/send";
import { MESSAGES, STATUS } from "#src/response/status";
import { FIXED_EXT_NAMES } from "@flow/db";

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(router);
  app.use((_req, _res, next) => next(new NotFoundError()));
  app.use((err, _req, res, _next) => {
    const status = err.status ?? STATUS.INTERNAL_SERVER_ERROR;
    const message = status >= 500 ? MESSAGES.INTERNAL_SERVER_ERROR : err.message;
    sendError(res, status, message);
  });
  
  return app;
}

describe("routers /api/exts", () => {
  const app = createApp();

  it("GET /api/exts 가 envelope 로 200 을 반환하는가?", async () => {
    const res = await request(app).get("/api/exts").expect(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.status).toBe(200);
    expect(res.body.error).toBe(null);
    expect(res.body.data.custom).toEqual([]);
    expect(res.body.data.fixed.map((r) => r.name)).toEqual([...FIXED_EXT_NAMES]);
    expect(res.body.data.fixed.every((r) => r.checked === false)).toBe(true);
  });

  it("POST /api/exts/custom 가 201 을 반환하는가?", async () => {
    const res = await request(app)
      .post("/api/exts/custom")
      .send({ name: "x" })
      .expect(201);

    expect(res.body).toEqual({
      ok: true,
      status: 201,
      data: { name: "x" },
      error: null,
    });
  });

  it("PATCH /api/exts/fixed/:name 가 200 을 반환하는가?", async () => {
    const res = await request(app)
      .patch("/api/exts/fixed/bat")
      .send({ checked: true })
      .expect(200);

    expect(res.body).toMatchObject({
      ok: true,
      status: 200,
      data: { name: "bat", checked: true },
      error: null,
    });
  });

  it("DELETE /api/exts/custom/:name 가 200 을 반환하는가?", async () => {
    await request(app).post("/api/exts/custom").send({ name: "bar" }).expect(201);
    const res = await request(app).delete("/api/exts/custom/bar").expect(200);

    expect(res.body).toEqual({
      ok: true,
      status: 200,
      data: { name: "bar" },
      error: null,
    });
  });

  it("DELETE /api/exts/custom 가 200 을 반환하고 후속 GET 에서 custom 이 비는가?", async () => {
    const ts = Date.now();
    await request(app).post("/api/exts/custom").send({ name: `all1${ts}` }).expect(201);
    await request(app).post("/api/exts/custom").send({ name: `all2${ts}` }).expect(201);
    const delRes = await request(app).delete("/api/exts/custom").expect(200);
    expect(delRes.body).toEqual({
      ok: true,
      status: 200,
      data: { deleted: 2 },
      error: null,
    });
    const getRes = await request(app).get("/api/exts").expect(200);
    expect(getRes.body.data.custom).toEqual([]);
  });

  it("알 수 없는 경로가 404 envelope 를 반환하는가?", async () => {
    const res = await request(app).get("/api/nope").expect(404);

    expect(res.body).toEqual({
      ok: false,
      status: 404,
      data: null,
      error: { message: MESSAGES.NOT_FOUND },
    });
  });
});
