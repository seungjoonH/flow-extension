function useValidator() {

  const validateCharacter = (name: string) => name.length && !/^[a-zA-Z0-9]+$/.test(name);
  const validateLength = (name: string) => name.length > 20;

  const validateExtension = (name: string) => {
    if (validateCharacter(name)) return "확장자는 영문자/숫자 이외의 문자를 사용할 수 없습니다";
    if (validateLength(name)) return "확장자는 20자를 초과하여 입력할 수 없습니다";
    return null;
  }

  return { validateExtension };
}

export default useValidator;