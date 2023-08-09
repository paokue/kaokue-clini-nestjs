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
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller({ version: '1', path: 'roles' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return {
      id: role.id,
      name: role.name,
    };
  }

  @Get()
  async findAll() {
    const { roles, total } = await this.rolesService.findAll();
    return { roles, total };
  }

  @Get('paginate')
  async findAllWithPagination(@Query() query: any) {
    const { roles, total } = await this.rolesService.findAllWithPagination(
      query.page,
      query.page_size,
    );
    return { roles, total };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      const result = await this.rolesService.update(+id, updateRoleDto);
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
      const result = await this.rolesService.remove(+id);
      if (result.affected === 0) {
        throw new HttpException('Server error', HttpStatus.BAD_REQUEST);
      }
      return { message: 'DELETE_SUCCESS' };
    } catch (error) {
      return { message: 'Something went wrong' };
    }
  }
}
