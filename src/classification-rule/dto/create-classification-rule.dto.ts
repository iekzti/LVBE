import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export default class CreateClassificationRule {
    @ApiProperty({ type: String, required: true, example: 'File name' })
    @IsString()
    name: string;

    @ApiProperty({ type: String, required: true, example: "Topic" })
    @IsString()
    topic: string;

    @ApiProperty({ type: String, required: true, example: "File-name" })
    @IsString()
    fileName: string;

    @ApiProperty({ type: String, required: true, example: "File-path" })
    @IsString()
    filePath: string;
  }