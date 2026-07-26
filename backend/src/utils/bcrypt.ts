import bcrypt from "bcrypt";

const saltRounds: number = 10;
const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};
const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
export { hashPassword, comparePassword };
