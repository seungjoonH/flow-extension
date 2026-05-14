import { FIXED_EXT_NAMES } from "@flow/db";
import { CUSTOM_MAX } from "#src/rules";
import * as repo from "#src/repository";

describe("repository", () => {
  describe("1. 고정 확장자 초기 리스트가 bat, cmd, com, cpl, exe, scr, js 인가?", () => {
    it("고정 확장자 이름 목록이 위 7개와 동일한 순서 및 구성이다", () => {
      const fixed = repo.getFixedExts();
      expect(fixed.map((r) => r.name)).toEqual([...FIXED_EXT_NAMES]);
    });
  });

  describe("2. 모든 고정 확장자 리스트가 default 값이 unchecked 인가?", () => {
    it("초기 조회 시 고정 항목은 모두 checked === 0 이다", () => {
      const fixed = repo.getFixedExts();
      expect(fixed.length).toBe(FIXED_EXT_NAMES.length);
      expect(fixed.every((r) => r.checked === 0)).toBe(true);
    });
  });

  describe("3. 고정 확장자를 check or uncheck 할 경우, db 에 반영이 되는가?", () => {
    it("체크 후 조회하면 true, 다시 해제 후 조회하면 false 로 유지된다", () => {
      repo.updateFixedExt("bat", true);
      expect(
        Boolean(repo.getFixedExts().find((r) => r.name === "bat")?.checked),
      ).toBe(true);
      repo.updateFixedExt("bat", false);
      expect(
        Boolean(repo.getFixedExts().find((r) => r.name === "bat")?.checked),
      ).toBe(false);
    });
  });

  describe("4. 동일한 커스텀 확장자 이름을 두 번 저장하면 DB 가 거부하는가?", () => {
    it("두 번째 INSERT 는 UNIQUE 제약으로 실패한다", () => {
      const name = `dup-${Date.now()}`;
      expect(repo.createCustomExt(name).changes).toBe(1);
      expect(() => repo.createCustomExt(name)).toThrow(/constraint|UNIQUE/i);
      repo.deleteCustomExt(name);
    });
  });

  describe("5. 커스텀 확장자를 추가할 수 있는가?", () => {
    it("INSERT changes 가 1이고 조회 목록에 해당 이름이 있다", () => {
      const name = `add-${Date.now()}`;
      const out = repo.createCustomExt(name);
      expect(out.changes).toBe(1);
      expect(repo.getCustomExts().map((c) => c.name)).toContain(name);
      repo.deleteCustomExt(name);
    });
  });

  describe("6. 커스텀 확장자를 최대 CUSTOM_MAX 건까지 DB 에 쌓을 수 있는가?", () => {
    it("서로 다른 이름을 CUSTOM_MAX 번 넣으면 조회 시 CUSTOM_MAX 건이다", () => {
      const start = repo.getCustomExts().length;
      const ts = Date.now();
      for (let i = 0; i < CUSTOM_MAX - start; i++) {
        repo.createCustomExt(`fill-${ts}-${i}`);
      }
      expect(repo.getCustomExts().length).toBe(CUSTOM_MAX);
      for (let i = 0; i < CUSTOM_MAX - start; i++) {
        repo.deleteCustomExt(`fill-${ts}-${i}`);
      }
    });
  });

  describe("7. 커스텀 확장자를 삭제할 수 있는가?", () => {
    it("삭제 후 조회 목록에 해당 이름이 없다", () => {
      let custom = repo.getCustomExts();
      if (custom.length >= CUSTOM_MAX) {
        repo.deleteCustomExt(custom[0].name);
        custom = repo.getCustomExts();
      }
      const name = `del-${Date.now()}`;
      repo.createCustomExt(name);
      expect(repo.getCustomExts().some((c) => c.name === name)).toBe(true);
      repo.deleteCustomExt(name);
      expect(repo.getCustomExts().some((c) => c.name === name)).toBe(false);
    });
  });

  describe("8. 커스텀 확장자 전체 삭제", () => {
    it("deleteAllCustomExts 후 커스텀이 비어 있고 고정 행 개수는 유지된다", () => {
      const ts = Date.now();
      repo.createCustomExt(`wall-${ts}-1`);
      repo.createCustomExt(`wall-${ts}-2`);
      repo.deleteAllCustomExts();
      expect(repo.getCustomExts()).toEqual([]);
      expect(repo.getFixedExts().length).toBe(FIXED_EXT_NAMES.length);
    });
  });
});
