import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class LockGradingModulesDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  ids: string[];

  @IsBoolean()
  @IsNotEmpty()
  lock: boolean;
}
