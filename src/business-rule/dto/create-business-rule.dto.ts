import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";


export default class CreateBusinessRule {
    @ApiProperty({ type: String, required: true, example: 'File name' })
    @IsString()
    name: string;

    @ApiProperty({ type: String, required: true, example: "Topic" })
    @IsString()
    topic: string;

    @ApiProperty({ type: String, required: true, example: "File-task-name" })
    @IsString()
    fileName: string;

    @ApiProperty({ type: String, required: true, example: "File-task-path" })
    @IsString()
    filePath: string;

    @ApiProperty({ type: Number, required: true, example: 1 })
    @IsNumber()
    businessProcessId: number;
  }