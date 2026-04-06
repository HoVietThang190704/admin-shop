export interface User {
  _id?: string; 
  username: string;
  email: string;
  fullName: string;
  name: string;
  rule: string;
  avatar_url?: string;
  isActive: boolean;
  created: {
    time: Date;
  };
  modified: {
    time: Date;
  };
}