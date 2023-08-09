import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new User();
      (user.firstName = createUserDto.first_name),
        (user.lastName = createUserDto.last_name),
        (user.email = createUserDto.email),
        (user.salary = createUserDto.salary),
        (user.username = createUserDto.username),
        (user.password = await argon2.hash(createUserDto.password)),
        (user.profile_image = createUserDto.profile_image),
        (user.signature = createUserDto.signature),
        (user.roleId = 1),
        (user.status = true);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.errno === 1062) {
        throw new HttpException(
          'Username or email already exists',
          HttpStatus.CONFLICT,
        ); // 409
      }
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST); // 400
    }
  }

  async findAll(): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.usersRepository.findAndCount({
      order: { id: 'DESC' },
    });
    return { users, total };
  }

  async findAllWithPagination(
    page: number,
    page_size: number,
  ): Promise<{ users: User[]; count: number }> {
    if (page_size > 50) {
      throw new HttpException(
        'Number of data must be less then 50',
        HttpStatus.BAD_REQUEST,
      );
    }
    const [users, count] = await this.usersRepository.findAndCount({
      skip: (page - 1) * page_size,
      take: page_size,
      order: { id: 'DESC' },
    });
    return { users, count };
  }

  // example of using sql
  // async findAll() {
  //   const sql = 'select * from user order by id desc'
  //   return await this.usersRepository.query(sql);
  // }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }
}
