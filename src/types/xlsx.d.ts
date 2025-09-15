/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'xlsx' {
  export function read(data: ArrayBuffer | string, opts?: any): any;
  export const utils: any;
  const x: any;
  export default x;
}
