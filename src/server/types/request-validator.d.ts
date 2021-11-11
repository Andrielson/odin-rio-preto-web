declare interface RequestValidator<T> {
  validate(requestBody: any): T;
}
