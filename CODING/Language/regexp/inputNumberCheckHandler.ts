export const inputNumberCheckHandler = (value: string) => {
  const floatRegexp = /^[0-9]*?[.]?[0-9]*?$/;

  return floatRegexp.test(value);
};