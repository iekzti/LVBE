import { unescape } from 'querystring';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BusinessProcessService } from './business-process.service';
import RunAlgorithm2Dto from './dto/algorithm-2-request.dto';
import ConfirmBPDto from './dto/confirm-bp.dto';
import CreateBusinessProcess from './dto/create-business-process.dto';
import { Task } from '@prisma/client';

@ApiTags('Business-process')
@Controller('business-process')
export class BusinessProcessController {
  constructor(
    private readonly businessProcessService: BusinessProcessService,
  ) {}

  @Get('test')
  test() {
    return unescape(
      '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0"',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  createBusinessProcess(
    @GetUser('sub') userId: number,
    @Body() dto: CreateBusinessProcess,
  ) {
    return this.businessProcessService.createBusinessProcess(userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  getAllBusinessProcess(@GetUser('sub') userId: number) {
    return this.businessProcessService.getAllBusinessProcess(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get(':id')
  getBusinessProcess(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('sub') userId: number,
  ) {
    return this.businessProcessService.getBusinessProcess(id, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteBusinessRule(@Param('id', ParseIntPipe) id: number) {
    return this.businessProcessService.deleteBusinessProcess(id);
  }

  @Get('change-position')
  changePositionTask() {
    return this.businessProcessService.changePositionTask(
      7,
      'Activity_1sdmwa3',
      'Activity_0xfwkzk',
      'Activity_1esaky0',
    );
  }

  @Get('remove-position')
  removePosition() {
    return this.businessProcessService.removePositionTask(
      7,
      'Activity_1g59bv9',
      'Activity_0jpmytr',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('run-algorithm2')
  runAlgorithm2(@Body() dto: RunAlgorithm2Dto) {
    return this.businessProcessService.runAlgorithm2(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('confirm')
  confirmBP(@GetUser('sub') userId: number, @Body() dto: ConfirmBPDto) {
    return this.businessProcessService.handleConfirmBP(userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put('tasks')
  updateTasks(@Body('tasks') tasks: Task[]) {
    return this.businessProcessService.updateBusinessProcessTasks(tasks);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get(':id/tasks')
  getTasks(@Param('id', ParseIntPipe) bpId: number) {
    return this.businessProcessService.getTasks(bpId);
  }
}
