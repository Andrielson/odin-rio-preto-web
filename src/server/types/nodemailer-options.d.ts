declare interface NodemailerOptions {
  service?: string;
  host?: string;
  port?: string;
  secure?: boolean;
  pool?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}
