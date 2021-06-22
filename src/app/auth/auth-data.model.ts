export interface AuthData {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
  mobile: string;
  customize: {
    "description": boolean,
    "severity": boolean,
    "status": boolean,
    "createdDate": boolean,
    "resolvedDate": boolean
  }
}
