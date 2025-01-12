export interface JwtPayload {
  id: number;
  username: string;
  name: string;
  iat?: number;
  exp?: number;
}