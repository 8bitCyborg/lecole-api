import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class, ClassSchema } from './schemas/classes.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ClassesService {
  constructor(@InjectModel(Class.name) private classModel: Model<Class>) {}

  // create(createClassDto: CreateClassDto) {
  //   return 'This action adds a new class';
  // }

  async findAll(schoolId: string) {
    const classes = await this.classModel.find({ schoolId: schoolId });
    console.log('Classes: ', schoolId, classes);
    return classes;
  }

  async findClass(classId: string) {
    const classData = await this.classModel
      .findById(classId)
      .populate('subjects');
    console.log('Class: ', classId, classData);
    return classData;
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    const updatedClass = await this.classModel.findByIdAndUpdate(
      id,
      updateClassDto,
    );
    console.log('Updated class: ', updatedClass);
    return updatedClass;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
