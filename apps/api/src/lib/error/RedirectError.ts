export class RedirectError {
  constructor(public to: string) {}

  display() {
    return {
      to: this.to,
    };
  }
}
