export interface InvalidCredentials {
  status: false;
  message: "invalid email or password";
}

export interface LoginSuccess {
  status: true;
  message: string;
}
