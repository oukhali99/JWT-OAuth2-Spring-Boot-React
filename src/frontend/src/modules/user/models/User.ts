export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  authorityStringList: string[];
  friends: User[];
  createdAt: Date;
  updatedAt: Date;
}
