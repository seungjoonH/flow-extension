import {
  deleteExtsCustom,
  getExts,
  patchExtsFixed,
  postExtsCustom,
} from "#src/service";
import { HttpError } from "#src/response/error";
import { STATUS } from "#src/response/status";

const FIXED_NAMES = ["bat", "cmd", "com", "cpl", "exe", "scr", "js"];

const CUSTOM_NAME_MAX = 20;
const CUSTOM_MAX = 200;

const EXT_MSG = {
  NAME_TOO_LONG: "Extension name must be at most 20 characters",
  LIST_FULL: "Custom extensions cannot exceed 200 items",
};

describe("과제 요구사항", () => {
  describe("1. 고정 확장자 리스트가 bat, cmd, com, cpl, exe, scr, js 인가?", () => {
    it("고정 확장자 이름 목록이 위 7개와 동일한 순서 및 구성이다", () => {
      const { fixed } = getExts();
      expect(fixed.map((r) => r.name)).toEqual(FIXED_NAMES);
    });
  });

  describe("2. 모든 고정 확장자 리스트가 default 값이 unchecked 인가?", () => {
    it("초기 조회 시 고정 항목은 모두 checked === false 이다", () => {
      const { fixed } = getExts();
      expect(fixed.length).toBe(FIXED_NAMES.length);
      expect(fixed.every((r) => r.checked === false)).toBe(true);
    });
  });

  describe("3. 고정 확장자를 check or uncheck 할 경우, db 에 반영이 되는가?", () => {
    it("체크 후 조회하면 true, 다시 해제 후 조회하면 false 로 유지된다", () => {
      patchExtsFixed("bat", { checked: true });
      expect(getExts().fixed.find((r) => r.name === "bat")?.checked).toBe(
        true,
      );
      patchExtsFixed("bat", { checked: false });
      expect(getExts().fixed.find((r) => r.name === "bat")?.checked).toBe(
        false,
      );
    });
  });

  describe("4. 20자 이상의 커스텀 확장자가 들어올 경우, 작업을 중지하고 올바른 에러를 전달하는가?", () => {
    it("21자 이상이면 HttpError(BAD_REQUEST)와 안내 메시지를 던진다", () => {
      const name = "a".repeat(CUSTOM_NAME_MAX + 1);
      expect(() => postExtsCustom({ name })).toThrow(HttpError);
      try {
        postExtsCustom({ name });
      } catch (e) {
        expect(e.status).toBe(STATUS.BAD_REQUEST);
        expect(e.message).toBe(EXT_MSG.NAME_TOO_LONG);
      }
    });
  });

  describe("5. 커스텀 확장자를 추가할 수 있는가?", () => {
    it("추가 후 GET 응답의 custom 목록에 해당 이름이 포함된다", () => {
      const name = `add-${Date.now()}`;
      postExtsCustom({ name });
      expect(getExts().custom.map((c) => c.name)).toContain(name);
    });
  });

  describe("6. 200개를 초과하여 커스텀 확장자를 추가하면 작업을 중지하고 올바른 에러를 전달하는가?", () => {
    it("커스텀이 200건일 때 신규 이름 추가 시 HttpError(BAD_REQUEST)와 안내 메시지", () => {
      const start = getExts().custom.length;
      for (let i = 0; i < CUSTOM_MAX - start; i++) {
        postExtsCustom({ name: `cap-${i}-${Date.now()}` });
      }
      expect(getExts().custom.length).toBe(CUSTOM_MAX);
      expect(() =>
        postExtsCustom({ name: `overflow-${Date.now()}` }),
      ).toThrow(HttpError);
      try {
        postExtsCustom({ name: `overflow-${Date.now()}` });
      } catch (e) {
        expect(e.status).toBe(STATUS.BAD_REQUEST);
        expect(e.message).toBe(EXT_MSG.LIST_FULL);
      }
    });
  });

  describe("7. 커스텀 확장자를 삭제할 수 있는가?", () => {
    it("삭제 후 조회 목록에 해당 이름이 없다", () => {
      let { custom } = getExts();
      if (custom.length >= CUSTOM_MAX) {
        deleteExtsCustom(custom[0].name);
      }
      const name = `del-${Date.now()}`;
      postExtsCustom({ name });
      expect(getExts().custom.some((c) => c.name === name)).toBe(true);
      deleteExtsCustom(name);
      expect(getExts().custom.some((c) => c.name === name)).toBe(false);
    });
  });
});
