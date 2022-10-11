import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export default class CreateBusinessProcess {
    @ApiProperty({ type: String, required: true, example: 'File name' })
    @IsString()
    name: string;

    @ApiProperty({ type: String, required: true, example: "Topic" })
    @IsString()
    topic: string;

    @ApiProperty({ type: String, required: true, example: "File-task-name" })
    @IsString()
    fileTaskName: string;

    @ApiProperty({ type: String, required: true, example: "File-task-path" })
    @IsString()
    fileTaskPath: string;

    @ApiProperty({ type: String, required: true, example: "File-BPMN-name" })
    @IsString()
    fileBPMNName: string;

    @ApiProperty({ type: String, required: true, example: "File-BPMN-path" })
    @IsString()
    fileBPMNPath: string;
  }