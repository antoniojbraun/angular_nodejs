export interface IUser {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}
