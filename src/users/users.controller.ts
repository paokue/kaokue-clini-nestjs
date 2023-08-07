import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({ version: '1', path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      id: user.id,
      fullname: user.firstName + user.lastName,
      email: user.email,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.usersService.update(+id, updateUserDto);
      if (result.affected === 0) {
        throw new HttpException(
          'Internal server error',
          HttpStatus.BAD_REQUEST,
        );
      }
      return { message: 'UPDATE_SUCCESS' };
    } catch (error) {
      return { message: 'Something went wrong' };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.usersService.remove(+id);
      if (result.affected === 0) {
        throw new HttpException('Server error', HttpStatus.BAD_REQUEST);
      }
      return { message: 'DELETE_SUCCESS' };
    } catch (error) {
      return { message: 'Something went wrong' };
    }
  }
}
