export class HttpError {
  constructor(
    public code: number,
    public error?:
      | {
          [x: string]: string[] | string | undefined;
        }
      | string[]
      | string
  ) {}

  display() {
    return {
      code: this.code,
      error: this.error,
    };
  }
}
