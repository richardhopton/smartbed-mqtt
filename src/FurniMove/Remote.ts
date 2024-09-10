type ComplexCommand = {
  data: number;
  duration: number;
  frequency: number;
};
type Commands = {
  [key: string]: number | ComplexCommand;
};
export type Remote = {
  name: string;
  commands: Commands;
};
