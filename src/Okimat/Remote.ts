type ComplexCommand = {
  data: number;
  count: number;
  waitTime: number;
};
type Commands = {
  [key: string]: number | ComplexCommand;
};
export type Remote = {
  name: string;
  commands: Commands;
};
