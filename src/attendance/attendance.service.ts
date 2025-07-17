import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance } from './schemas/attendance.schema';
import { Model } from 'mongoose';
import { SaveAttendanceDto } from './schemas/save-attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
  ) {}

  /**
   * Save attendance records for a class.
   * @param saveAttendanceDto - An array of attendance records to be saved.
   * @returns The saved attendance records.
   */
  async saveClassAttendance(saveAttendanceDto: SaveAttendanceDto) {
    try {
      await this.attendanceModel.deleteMany({
        classId: saveAttendanceDto[0]?.classId,
        date: saveAttendanceDto[0]?.date,
        termId: saveAttendanceDto[0]?.termId,
      });
      const attendance =
        await this.attendanceModel.insertMany(saveAttendanceDto);
      return attendance;
    } catch (error) {
      throw new BadRequestException(`Invalid ID format: ${error}`);
    }
  }

  /**
   * Fetch all attendance records for a specific class, term, and date.
   * @param classId - The ID of the class.
   * @param termId - The ID of the term.
   * @param date - The date for which attendance is being queried.
   * @returns An array of attendance records.
   */
  async findAll(classId: string, termId: string, date: string) {
    try {
      return await this.attendanceModel.find({
        classId,
        date: new Date(date),
        termId,
      });
    } catch (error) {
      throw new BadRequestException(`Error fetching attendance: ${error}`);
    }
  }
}
