import {
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role = new Role();
      role.name = createRoleDto.name;
      return await this.rolesRepository.save(role);
    } catch (error) {
      if (error.errno === 1062) {
        throw new HttpException('Role already exists!', HttpStatus.CONFLICT); // 409
      }
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST); // 400
    }
  }

  async findAll(): Promise<{ roles: Role[]; total: number }> {
    const [roles, total] = await this.rolesRepository.findAndCount({
      order: { createdAt: 'DESC' },
    });
    return { roles, total };
  }

  async findAllWithPagination(
    page: number,
    page_size: number,
  ): Promise<{ roles: Role[]; total: number }> {
    if (page_size > 50) {
      throw new HttpException(
        'Number of page_size should less then 50',
        HttpStatus.BAD_REQUEST,
      );
    }
    const [roles, total] = await this.rolesRepository.findAndCount({
      skip: (page - 1) * page_size,
      take: page_size,
      order: { id: 'DESC' },
    });
    return { roles, total };
  }

  async findOne(id: number) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async update(
    id: number,
    UpdateRoleDto: UpdateRoleDto,
  ): Promise<UpdateResult> {
    return await this.rolesRepository.update(id, UpdateRoleDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.rolesRepository.delete(id);
  }
}
