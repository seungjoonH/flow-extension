import { FIXED_EXT_NAMES } from "@flow/db";
import { CUSTOM_MAX, CUSTOM_NAME_MAX } from "#src/rules";
import * as service from "#src/service";
import * as error from "#src/response/error";
import { EXT_MESSAGES, STATUS } from "#src/response/status";

describe("과제 요구사항", () => {
  describe("1. 고정 확장자 리스트가 bat, cmd, com, cpl, exe, scr, js 인가?", () => {
    it("고정 확장자 이름 목록이 위 7개와 동일한 순서 및 구성이다", () => {
      const { fixed } = service.getExts();
      expect(fixed.map((r) => r.name)).toEqual([...FIXED_EXT_NAMES]);
    });
  });

  describe("2. 모든 고정 확장자 리스트가 default 값이 unchecked 인가?", () => {
    it("초기 조회 시 고정 항목은 모두 checked === false 이다", () => {
      const { fixed } = service.getExts();
      expect(fixed.length).toBe(FIXED_EXT_NAMES.length);
      expect(fixed.every((r) => !r.checked)).toBe(true);
    });
  });

  describe("3. 고정 확장자를 check or uncheck 할 경우, 변경이 영속되는가?", () => {
    it("체크 후 조회하면 true, 다시 해제 후 조회하면 false 로 유지된다", () => {
      service.patchExtsFixed("bat", { checked: true });
      expect(service.getExts().fixed.find((r) => r.name === "bat")?.checked).toBe(true);
      service.patchExtsFixed("bat", { checked: false });
      expect(service.getExts().fixed.find((r) => r.name === "bat")?.checked).toBe(false);
    });
  });

  describe("4. 20자 이상의 커스텀 확장자가 들어올 경우, 작업을 중지하고 올바른 에러를 전달하는가?", () => {
    it("21자 이상이면 HttpError(BAD_REQUEST)와 안내 메시지를 던진다", () => {
      const name = "a".repeat(CUSTOM_NAME_MAX + 1);
      expect(() => service.postExtsCustom({ name })).toThrow(error.HttpError);
      try { service.postExtsCustom({ name }); } 
      catch (e) {
        expect(e.status).toBe(STATUS.BAD_REQUEST);
        expect(e.message).toBe(EXT_MESSAGES.NAME_TOO_LONG);
      }
    });
  });

  describe("5. 커스텀 확장자를 추가할 수 있는가?", () => {
    it("추가 후 GET 응답의 custom 목록에 해당 이름이 포함된다", () => {
      const name = `add${Date.now()}`;
      service.postExtsCustom({ name });
      expect(service.getExts().custom.map((c) => c.name)).toContain(name);
    });
  });

  describe("6. 200개를 초과하여 커스텀 확장자를 추가하면 작업을 중지하고 올바른 에러를 전달하는가?", () => {
    it("커스텀이 200건일 때 신규 이름 추가 시 HttpError(BAD_REQUEST)와 안내 메시지", () => {
      const start = service.getExts().custom.length;
      const ts = Date.now();
      for (let i = 0; i < CUSTOM_MAX - start; i++) service.postExtsCustom({ name: `c${i}x${ts}` });
      expect(() => service.postExtsCustom({ name: `o${ts}` })).toThrow(error.HttpError);
      try { service.postExtsCustom({ name: `o${ts}` }); } 
      catch (e) {
        expect(e.status).toBe(STATUS.BAD_REQUEST);
        expect(e.message).toBe(EXT_MESSAGES.LIST_FULL);
      }
    });
  });

  describe("7. 커스텀 확장자를 삭제할 수 있는가?", () => {
    it("삭제 후 조회 목록에 해당 이름이 없다", () => {
      let { custom } = service.getExts();
      if (custom.length >= CUSTOM_MAX) service.deleteExtsCustom(custom[0].name);
      const name = `del${Date.now()}`;
      service.postExtsCustom({ name });
      expect(service.getExts().custom.some((c) => c.name === name)).toBe(true);
      service.deleteExtsCustom(name);
      expect(service.getExts().custom.some((c) => c.name === name)).toBe(false);
    });
  });
});

describe("추가 구현 사항", () => {
  describe("커스텀 추가 요청이 고정 확장자와 이름이 겹칠 때", () => {
    it("고정 확장자가 꺼져 있으면 커스텀 목록에 넣지 않고, 해당 고정 항목만 켠다", () => {
      service.patchExtsFixed("js", { checked: false });
      expect(service.getExts().custom.some((c) => c.name === "js")).toBe(false);

      service.postExtsCustom({ name: "js" });

      expect(service.getExts().fixed.find((r) => r.name === "js")?.checked).toBe(true);
      expect(service.getExts().custom.some((c) => c.name === "js")).toBe(false);

      service.patchExtsFixed("js", { checked: false });
    });

    it("커스텀 추가로 고정 항목을 켠 뒤, 같은 이름으로 다시 추가하면 이미 체크되었다는 안내로 거절한다", () => {
      service.patchExtsFixed("exe", { checked: false });
      service.postExtsCustom({ name: "exe" });
      expect(service.getExts().fixed.find((r) => r.name === "exe")?.checked).toBe(true);

      expect(() => service.postExtsCustom({ name: "exe" })).toThrow();
      try { service.postExtsCustom({ name: "exe" }); } 
      catch (e) { expect(e.message).toBe(EXT_MESSAGES.ALREADY_BLOCKED); }

      service.patchExtsFixed("exe", { checked: false });
    });

    it("고정 확장자가 이미 켜져 있는데 같은 이름으로 커스텀을 추가하면, 이미 체크되었다는 안내로 거절한다", () => {
      service.patchExtsFixed("cmd", { checked: true });

      expect(() => service.postExtsCustom({ name: "cmd" })).toThrow();
      try { service.postExtsCustom({ name: "cmd" }); } 
      catch (e) { expect(e.message).toBe(EXT_MESSAGES.ALREADY_BLOCKED); }

      service.patchExtsFixed("cmd", { checked: false });
    });
  });
});


describe("에러 처리", () => {
  describe("postExtsCustom", () => {
    it("이름이 없으면 BadRequest(NAME_REQUIRED) 를 발생시키는가?", () => {
      expect(() => service.postExtsCustom({})).toThrow(error.BadRequestError);
      try { service.postExtsCustom({}); } 
      catch (e) {
        expect(e.status).toBe(STATUS.BAD_REQUEST);
        expect(e.message).toBe(EXT_MESSAGES.NAME_REQUIRED);
      }
    });

    it("이미 존재하는 커스텀 확장자면 이미 존재 안내로 거절한다", () => {
      const name = `dup${Date.now()}`;
      service.postExtsCustom({ name });
      expect(() => service.postExtsCustom({ name })).toThrow();
      try { service.postExtsCustom({ name }); } 
      catch (e) { expect(e.message).toBe(EXT_MESSAGES.ALREADY_BLOCKED); }
      service.deleteExtsCustom(name);
    });

    it("영문자·숫자 이외 문자가 있으면 BadRequest(NAME_INVALID_CHARS) 를 발생시키는가?", () => {
      expect(() => service.postExtsCustom({ name: "bad_name" })).toThrow(error.BadRequestError);
      try { service.postExtsCustom({ name: "bad_name" }); } 
      catch (e) {
        expect(e.status).toBe(STATUS.BAD_REQUEST);
        expect(e.message).toBe(EXT_MESSAGES.NAME_INVALID_CHARS);
      }

      expect(() => service.postExtsCustom({ name: "한글" })).toThrow(error.BadRequestError);
      try { service.postExtsCustom({ name: "한글" }); } 
      catch (e) {
        expect(e.status).toBe(STATUS.BAD_REQUEST);
        expect(e.message).toBe(EXT_MESSAGES.NAME_INVALID_CHARS);
      }
    });
  });

  describe("patchExtsFixed", () => {
    it("checked 가 없으면 BadRequest(CHECKED_REQUIRED) 를 발생시키는가?", () => {
      expect(() => service.patchExtsFixed("bat", {})).toThrow(error.BadRequestError);
      try { service.patchExtsFixed("bat", {}); } 
      catch (e) { expect(e.message).toBe(EXT_MESSAGES.CHECKED_REQUIRED); }
    });

    it("이름이 비어 있으면 BadRequest(NAME_REQUIRED) 를 발생시키는가?", () => {
      expect(() => service.patchExtsFixed("", { checked: true }))
        .toThrow(error.BadRequestError);
    });

    it("고정 목록에 없는 이름이면 NotFound 를 발생시키는가?", () => {
      expect(() => service.patchExtsFixed(`ghost-${Date.now()}`, { checked: true }))
        .toThrow(error.NotFoundError);
      
      try { service.patchExtsFixed(`ghost-${Date.now()}`, { checked: true }); } 
      catch (e) {
        expect(e.status).toBe(STATUS.NOT_FOUND);
        expect(e.message).toBe(EXT_MESSAGES.NOT_FOUND);
      }
    });
  });

  describe("deleteExtsCustom", () => {
    it("이름이 비어 있으면 BadRequest(NAME_REQUIRED) 를 발생시키는가?", () => {
      expect(() => service.deleteExtsCustom("")).toThrow(error.BadRequestError);
    });

    it("없는 이름이면 NotFound 를 발생시키는가?", () => {
      expect(() => service.deleteExtsCustom(`no-such-${Date.now()}`))
        .toThrow(error.NotFoundError);
    });
  });
});