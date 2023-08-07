export class CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  salary: number;
  username: string;
  password: string;
  profile_image: string;
  signature: string;
  role: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}
