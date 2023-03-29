export const wait = (timeout: number) => new Promise<void>((res: () => void) => setTimeout(res, timeout));
