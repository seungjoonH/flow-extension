export const getExts = () => {
  return { fixed: [], custom: [] };
};

export const postExtsCustom = (body) => {
  return { name: body?.name ?? "" };
};

export const patchExtsFixed = (name, body) => {
  return { name: name ?? "", ...body };
};

export const deleteExtsCustom = (name) => {
  return { name: name ?? "" };
};
