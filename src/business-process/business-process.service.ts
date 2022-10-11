import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import CreateBusinessProcess from './dto/create-business-process.dto';
import { BusinessProcess, Task } from '@prisma/client';
import {
  pathExistsSync,
  readFileSync,
  write,
  writeFileSync,
  removeSync,
  existsSync,
  readFile,
} from 'fs-extra';
import RunAlgorithm2Dto from './dto/algorithm-2-request.dto';
import { Builder, Parser } from 'xml2js';
import ConfirmBPDto from './dto/confirm-bp.dto';
import { unescape } from 'querystring';

@Injectable()
export class BusinessProcessService {
  constructor(private prisma: PrismaService) {}

  async createBusinessProcess(
    userId: number,
    dto: CreateBusinessProcess,
  ): Promise<BusinessProcess> {
    const newBP = await this.prisma.businessProcess.create({
      data: {
        name: dto.name,
        topic: dto.topic,
        fileTaskName: dto.fileTaskName,
        fileTaskPath: dto.fileTaskPath,
        fileBPMNName: dto.fileBPMNName,
        fileBPMNPath: dto.fileBPMNPath,
        userId,
      },
    });
    const cwd = process.cwd();
    const filetTaskString = await readFile(
      `${cwd}/${newBP.fileTaskPath}`,
      'utf8',
    );
    const json = JSON.parse(filetTaskString);
    for (const index in json) {
      await this.prisma.task.create({
        data: {
          businessProcessId: newBP.id,
          name: json[index]['name'],
        },
      });
    }
    return newBP;
  }

  getAllBusinessProcess(userId: number): Promise<BusinessProcess[]> {
    return this.prisma.businessProcess.findMany({ where: { userId } });
  }

  getBusinessProcess(id: number, userId: number): Promise<BusinessProcess> {
    return this.prisma.businessProcess.findFirst({ where: { id, userId } });
  }

  deleteBusinessProcess(id: number): Promise<BusinessProcess> {
    return this.prisma.businessProcess.delete({ where: { id } });
  }

  process() {
    const cwd = process.cwd();
    const listTaskToRemove: string[] = [];

    /* ----------------------------- Read file task ----------------------------- */
    const filetTaskString = readFileSync(
      `${cwd}/src/business-process/files/task.json`,
      'utf8',
    );
    const tasks = JSON.parse(filetTaskString);

    /* ---------------------------- Read file derive ---------------------------- */
    const fileDeriveString = readFileSync(
      `${cwd}/src/business-process/files/derive.json`,
      'utf8',
    );
    const derives = JSON.parse(fileDeriveString);

    for (const task in tasks) {
      const preTasks: string[] = [...tasks[task]['pre']].map((c: string) =>
        c.toLowerCase(),
      );
      const postTasks: string[] = [...tasks[task]['post']].map((c: string) =>
        c.toLowerCase(),
      );

      for (const derive in derives) {
        const condDerives: string[] = [...derives[derive]['cond']].map(
          (c: string) => c.toLowerCase(),
        );
        const consqntDerives: string[] = [...derives[derive]['consqnt']].map(
          (c: string) => c.toLowerCase(),
        );

        /* ------------------------------ Check PreTask ----------------------------- */
        const condDerivesIsExistInPreTasks = condDerives.every((value) =>
          preTasks.includes(value),
        );
        if (condDerivesIsExistInPreTasks) {
          for (const consqntDerive of consqntDerives) {
            if (!preTasks.includes(consqntDerive)) {
              preTasks.push(consqntDerive);
            }
          }
        }
        /* ----------------------------- Check PostTask ----------------------------- */
        const condDerivesIsExistInPostTasks = condDerives.every((value) =>
          postTasks.includes(value),
        );
        if (condDerivesIsExistInPostTasks) {
          for (const consqntDerive of consqntDerives) {
            if (!postTasks.includes(consqntDerive))
              postTasks.push(consqntDerive);
          }
        }
      }

      tasks[task]['pre'] = preTasks; // assign new pre task
      tasks[task]['post'] = postTasks; // assign new post task
    }

    /* -------------------------------------------------------------------------- */
    /*                              Add BusinessRules                             */
    /* -------------------------------------------------------------------------- */

    /* ------------------------- Read BusinessRule File ------------------------- */
    const fileBusinessRuleString = readFileSync(
      `${cwd}/src/business-process/files/businessRules.json`,
      'utf8',
    );
    const businessRules = JSON.parse(fileBusinessRuleString)['businessRules'];

    /* ---------------------------- Concat all rules ---------------------------- */
    const allRules: string[] = [];
    for (const br in businessRules) {
      const cond: string[] = businessRules[br]['cond'];
      for (const c of cond) {
        allRules.push(c.toLowerCase());
      }
      const consqnt: string[] = businessRules[br]['consqnt'];
      for (const c of consqnt) {
        allRules.push(c.toLowerCase());
      }
    }

    /* -------------------------- Add all rules to post ------------------------- */
    for (const task in tasks) {
      const postTasks: string[] = [...tasks[task]['post']].map((c: string) =>
        c.toLowerCase(),
      );

      for (const rule of allRules) {
        if (!postTasks.includes(rule)) {
          postTasks.push(rule);
        }
      }

      tasks[task]['postAllRules'] = postTasks; // assign new post task
    }

    /* -------------------------------------------------------------------------- */
    /*                                Add Tendency                                */
    /* -------------------------------------------------------------------------- */
    const fileTendencyString = readFileSync(
      `${cwd}/src/business-process/files/customerAcceptance.json`,
      // `${cwd}/src/business-process/files/tendency.json`,
      'utf8',
    );
    const tendency = JSON.parse(fileTendencyString);
    const cond: string[] = tendency['cond'].map((c: string) => c.toLowerCase());
    const consqnt: string[] = tendency['consqnt'].map((c: string) =>
      c.toLowerCase(),
    );
    let indexTask: string;

    for (const task in tasks) {
      const postTasksAllRules: string[] = [...tasks[task]['postAllRules']].map(
        (c: string) => c.toLowerCase(),
      );

      const condTendencyIsExistInPostTask = cond.every((value) =>
        postTasksAllRules.includes(value),
      );
      if (condTendencyIsExistInPostTask) {
        for (const c of consqnt) {
          postTasksAllRules.push(c);
        }
        indexTask = task;
        tasks[task]['post'] = postTasksAllRules;
      }

      if (!!indexTask) break;
    }

    console.log({ indexTask });

    /* -------------------------------------------------------------------------- */
    /*                               Check tendency                               */
    /* -------------------------------------------------------------------------- */
    if (!indexTask)
      return {
        originalTasks: tasks,
        removedTasks: tasks,
      };
    let taskFound = false;

    for (const task in tasks) {
      if (task === indexTask) {
        taskFound = true;
        continue;
      }
      if (!taskFound) continue;
      // if (task === 'task_13')
      //   console.log({
      //     task11: tasks[task],
      //     taskIndex: tasks[indexTask],
      //   });

      const preTasks: string[] = [...tasks[task]['pre']].map((c: string) =>
        c.toLowerCase(),
      );
      const postTasks: string[] = [...tasks[task]['post']].map((c: string) =>
        c.toLowerCase(),
      );
      const postIndexTasks: string[] = [...tasks[indexTask]['post']].map(
        (c: string) => c.toLowerCase(),
      );

      const postTaskIsExistInIndexPostTask = postTasks.every((value) =>
        postIndexTasks.includes(value),
      );
      if (postTaskIsExistInIndexPostTask) {
        listTaskToRemove.push(task);
      } else {
        for (const c of consqnt) {
          if (!preTasks.includes(c)) preTasks.push(c);
          if (!postTasks.includes(c)) postTasks.push(c);
        }
      }

      tasks[task]['pre'] = preTasks; // assign new pre task
      tasks[task]['post'] = postTasks; // assign new post task
    }

    /* -------------------------------------------------------------------------- */
    /*                            return after process                            */
    /* -------------------------------------------------------------------------- */
    const removedTasks = { ...tasks };
    for (const task of listTaskToRemove) {
      delete removedTasks[task];
    }
    const result = {
      // originTasks: tasks,
      // removedTasks: tasks,
      listTaskToRemove,
    };

    return result;
  }

  addDerives(tasks: any, businessProcessId?: number) {
    const cwd = process.cwd();
    /* ---------------------------- Read file derive ---------------------------- */
    const fileDeriveString = readFileSync(
      `${cwd}/src/business-process/files/derive.json`,
      'utf8',
    );
    const derives = JSON.parse(fileDeriveString);

    for (const task in tasks) {
      const preTasks: string[] = [...tasks[task]['pre']].map((c: string) =>
        c.toLowerCase(),
      );
      const postTasks: string[] = [...tasks[task]['post']].map((c: string) =>
        c.toLowerCase(),
      );

      for (const derive in derives) {
        const condDerives: string[] = [...derives[derive]['cond']].map(
          (c: string) => c.toLowerCase(),
        );
        const consqntDerives: string[] = [...derives[derive]['consqnt']].map(
          (c: string) => c.toLowerCase(),
        );

        /* ------------------------------ Check PreTask ----------------------------- */
        const condDerivesIsExistInPreTasks = condDerives.every((value) =>
          preTasks.includes(value),
        );
        if (condDerivesIsExistInPreTasks) {
          for (const consqntDerive of consqntDerives) {
            if (!preTasks.includes(consqntDerive)) {
              preTasks.push(consqntDerive);
            }
          }
        }
        /* ----------------------------- Check PostTask ----------------------------- */
        const condDerivesIsExistInPostTasks = condDerives.every((value) =>
          postTasks.includes(value),
        );
        if (condDerivesIsExistInPostTasks) {
          for (const consqntDerive of consqntDerives) {
            if (!postTasks.includes(consqntDerive))
              postTasks.push(consqntDerive);
          }
        }
      }

      tasks[task]['pre'] = preTasks; // assign new pre task
      tasks[task]['post'] = postTasks; // assign new post task
    }

    return tasks;
  }

  addBusinessRule(tasks: any, filePath: string) {
    const cwd = process.cwd();
    /* ------------------------- Read BusinessRule File ------------------------- */
    const fileBusinessRuleString = readFileSync(`${cwd}/${filePath}`, 'utf8');
    const businessRules = JSON.parse(fileBusinessRuleString)['businessRules'];

    /* ---------------------------- Concat all rules ---------------------------- */
    const allRules: string[] = [];
    for (const br in businessRules) {
      const cond: string[] = businessRules[br]['cond'];
      for (const c of cond) {
        allRules.push(c.toLowerCase());
      }
      const consqnt: string[] = businessRules[br]['consqnt'];
      for (const c of consqnt) {
        allRules.push(c.toLowerCase());
      }
    }

    /* -------------------------- Add all rules to post ------------------------- */
    for (const task in tasks) {
      const postTasks: string[] = [...tasks[task]['post']].map((c: string) =>
        c.toLowerCase(),
      );

      for (const rule of allRules) {
        if (!postTasks.includes(rule)) {
          postTasks.push(rule);
        }
      }

      tasks[task]['postAllRules'] = postTasks; // assign new post task
    }

    return tasks;
  }

  findTasksToRemove(tasks: any, file: string) {
    const cwd = process.cwd();
    /* -------------------------------- Read file ------------------------------- */
    const fileTendencyString = readFileSync(`${cwd}/${file}`, 'utf8');
    const tendency = JSON.parse(fileTendencyString);
    const cond: string[] = tendency['cond'].map((c: string) => c.toLowerCase());
    const consqnt: string[] = tendency['consqnt'].map((c: string) =>
      c.toLowerCase(),
    );
    /* ------------------------------- Find anchor ------------------------------ */
    let anchorTask: string;
    let anchorTaskId: string;

    for (const task in tasks) {
      const postTasksAllRules: string[] = [...tasks[task]['postAllRules']].map(
        (c: string) => c.toLowerCase(),
      );

      const condTendencyIsExistInPostTask = cond.every((value) =>
        postTasksAllRules.includes(value),
      );
      if (condTendencyIsExistInPostTask) {
        for (const c of consqnt) {
          postTasksAllRules.push(c);
        }
        anchorTask = task;
        anchorTaskId = tasks[task]['id'];
        tasks[task]['post'] = postTasksAllRules;
      }

      if (!!anchorTask) break;
    }

    console.log({ file, indexTask: anchorTask });

    if (!anchorTask)
      return {
        anchorTaskId,
        anchorTask,
        listTaskToRemove: [],
        listTaskIdToRemove: [],
        tasks: tasks,
        removedTasks: tasks,
      };

    /* -------------------------- Find tasks to remove -------------------------- */
    let taskFound = false; // for pur check task after anchor task
    const listTaskToRemove: string[] = [];
    const listTaskIdToRemove: string[] = [];

    for (const task in tasks) {
      if (task === anchorTask) {
        taskFound = true;
        continue;
      }
      if (!taskFound) continue;

      // if (task === 'task_13')
      //   console.log({
      //     task11: tasks[task],
      //     taskIndex: tasks[indexTask],
      //   });

      const preTasks: string[] = [...tasks[task]['pre']].map((c: string) =>
        c.toLowerCase(),
      );
      const postTasks: string[] = [...tasks[task]['post']].map((c: string) =>
        c.toLowerCase(),
      );
      const postIndexTasks: string[] = [...tasks[anchorTask]['post']].map(
        (c: string) => c.toLowerCase(),
      );

      const postTaskIsExistInIndexPostTask = postTasks.every((value) =>
        postIndexTasks.includes(value),
      );
      if (postTaskIsExistInIndexPostTask) {
        listTaskToRemove.push(task);
        listTaskIdToRemove.push(tasks[task]['id']);
      } else {
        for (const c of consqnt) {
          if (!preTasks.includes(c)) preTasks.push(c);
          if (!postTasks.includes(c)) postTasks.push(c);
        }
      }

      tasks[task]['pre'] = preTasks; // assign new pre task
      tasks[task]['post'] = postTasks; // assign new post task
    }

    /* -------------------------- return after process -------------------------- */
    const removedTasks = { ...tasks };
    for (const task of listTaskToRemove) {
      delete removedTasks[task];
    }
    console.log({file,listTaskToRemove})
    return {
      anchorTaskId,
      anchorTask,
      listTaskToRemove,
      listTaskIdToRemove,
      tasks: tasks,
      removedTasks,
    };
  }

  algorithm1() {
    const cwd = process.cwd();
    /* ----------------------------- Read file task ----------------------------- */
    const filetTaskString = readFileSync(
      `${cwd}/src/business-process/files/task.json`,
      'utf8',
    );
    const tasks = JSON.parse(filetTaskString);

    /* ----------------------------------- Run ---------------------------------- */
    const tasksWithDerives = this.addDerives(tasks);
    const tasksWithBRs = this.addBusinessRule(
      tasksWithDerives,
      'src/business-process/files/businessRules.json',
    );
    const resultWithTendency = this.findTasksToRemove(
      tasksWithBRs,
      'src/business-process/files/tendency.json',
    );
    const resultWithCusAccept = this.findTasksToRemove(
      tasksWithBRs,
      'src/business-process/files/customerAcceptance.json',
    );

    /* --------------------------------- Return --------------------------------- */
    return {
      resultWithCusAccept,
      resultWithTendency,
    };
  }

  algorithm2() {
    /* ----------------------------- Run algorithm 1 ---------------------------- */
    const resultAlgorithm1 = this.algorithm1();
    const { resultWithCusAccept, resultWithTendency } = resultAlgorithm1;

    /* ------------------ Assign tendency anchor to cus accept ------------------ */
    resultWithCusAccept.tasks[resultWithTendency.anchorTask] = {
      ...resultWithTendency.tasks[resultWithTendency.anchorTask],
    };

    /* -------------------------------- Read tendency ------------------------------- */
    const cwd = process.cwd();
    const fileTendencyString = readFileSync(
      `${cwd}/src/business-process/files/tendency.json`,
      'utf8',
    );
    const tendency = JSON.parse(fileTendencyString);
    const consqnt: string[] = tendency['consqnt'].map((c: string) =>
      c.toLowerCase(),
    );

    /* --------------------------- Add consqnt tendency after anchor -------------------------- */
    let foundAnchor = false;
    for (const task in resultWithCusAccept.tasks) {
      if (task === resultWithTendency.anchorTask) {
        foundAnchor = true;
        continue;
      }
      if (!foundAnchor) continue;

      const postTasks: string[] = [...resultWithCusAccept.tasks[task]['post']];
      for (const c of consqnt) if (!postTasks.includes(c)) postTasks.push(c);

      resultWithCusAccept.tasks[task]['post'] = postTasks;
    }

    /* ----------------------------------- Run ---------------------------------- */
    foundAnchor = false;
    for (const currentTask in resultWithCusAccept.tasks) {
      if (currentTask === resultWithCusAccept.anchorTask) {
        foundAnchor = true;
        continue;
      }
      if (!foundAnchor) continue;

      let counter = 0;
      let foundCurrentTask = false;
      for (const loop2task in resultWithCusAccept.tasks) {
        if (loop2task === currentTask) {
          foundCurrentTask = true;
          continue;
        }
        if (!foundCurrentTask) {
          continue;
        } else {
          counter++;
        }
        if (counter < 2) continue;

        const preLoop2Task = [...resultWithCusAccept.tasks[loop2task]['pre']];
        const postCurrentTask = [
          ...resultWithCusAccept.tasks[currentTask]['post'],
        ];

        const preLoop2ISExistInPostCurrent = preLoop2Task.every((value) =>
          postCurrentTask.includes(value),
        );
        if (preLoop2ISExistInPostCurrent) {
          return {
            parent: currentTask,
            child: loop2task,
          };
        }
      }
    }
  }

  async runAlgorithm1(dto: RunAlgorithm2Dto) {
    /* ------------------------------- Find Files ------------------------------- */
    const bp = await this.prisma.businessProcess.findUnique({
      where: { id: dto.businessProcessId },
    });
    const br = await this.prisma.businessRule.findFirst({
      where: { businessProcessId: dto.businessProcessId },
    });
    const cr1 = await this.prisma.classificationRule.findUnique({
      where: { id: dto.classificationRule1Id },
    });
    const cr2 = await this.prisma.classificationRule.findUnique({
      where: { id: dto.classificationRule2Id },
    });

    /* ----------------------------- Read file task ----------------------------- */
    const cwd = process.cwd();
    const filetTaskString = readFileSync(`${cwd}/${bp.fileTaskPath}`, 'utf8');
    const tasks = JSON.parse(filetTaskString);

    /* ----------------------------------- Run ---------------------------------- */
    const tasksWithDerives = this.addDerives(tasks, dto.businessProcessId);
    const tasksWithBRs = this.addBusinessRule(tasksWithDerives, br.filePath);
    const resultWithTendency = this.findTasksToRemove(
      tasksWithBRs,
      cr1.filePath,
    );
    const resultWithCusAccept = this.findTasksToRemove(
      tasksWithBRs,
      cr2.filePath,
    );

    /* --------------------------------- Return --------------------------------- */
    console.log({
      result: 'Ket qua giai thuat 1',
      index: resultWithTendency.anchorTask,
      tasks: JSON.stringify(resultWithTendency.tasks),
    });

    return {
      resultWithCusAccept,
      resultWithTendency,
    };
  }

  async runAlgorithm2(dto: RunAlgorithm2Dto) {
    const cr1 = await this.prisma.classificationRule.findUnique({
      where: { id: dto.classificationRule1Id },
    });

    /* ----------------------------- Run algorithm 1 ---------------------------- */
    const resultAlgorithm1 = await this.runAlgorithm1(dto);
    const { resultWithCusAccept, resultWithTendency } = resultAlgorithm1;
    if (resultWithTendency.listTaskIdToRemove.length > 0) {
      for (const taskId of resultWithTendency.listTaskIdToRemove) {
        await this.removePositionTask(
          dto.businessProcessId,
          resultWithTendency.anchorTaskId,
          taskId,
        );
      }
    }

    /* ------------------------ Store new listTaskRemoved ----------------------- */
    const cwd = process.cwd();
    writeFileSync(
      `${cwd}/uploads/removed-tasks-${dto.businessProcessId}.json`,
      JSON.stringify(resultWithTendency.removedTasks),
    );
    await this.prisma.businessProcess.update({
      where: { id: dto.businessProcessId },
      data: {
        fileTaskAfterRemovePath: `uploads/removed-tasks-${dto.businessProcessId}.json`,
      },
    });

    /* ------------------ Assign tendency anchor to cus accept ------------------ */
    resultWithCusAccept.tasks[resultWithTendency.anchorTask] = {
      ...resultWithTendency.tasks[resultWithTendency.anchorTask],
    };

    /* -------------------------------- Read tendency ------------------------------- */
    const fileTendencyString = readFileSync(`${cwd}/${cr1.filePath}`, 'utf8');
    const tendency = JSON.parse(fileTendencyString);
    const consqnt: string[] = tendency['consqnt'].map((c: string) =>
      c.toLowerCase(),
    );

    /* --------------------------- Add consqnt tendency after anchor -------------------------- */
    let foundAnchor = false;
    for (const task in resultWithCusAccept.tasks) {
      if (task === resultWithTendency.anchorTask) {
        foundAnchor = true;
        continue;
      }
      if (!foundAnchor) continue;

      const postTasks: string[] = [...resultWithCusAccept.tasks[task]['post']];
      for (const c of consqnt) if (!postTasks.includes(c)) postTasks.push(c);

      resultWithCusAccept.tasks[task]['post'] = postTasks;
    }

    /* ----------------------------------- Run ---------------------------------- */
    foundAnchor = false;

    const result = {
      indexNameAlg1:
        resultWithTendency.tasks[resultWithTendency.anchorTask]['name'],
      indexNameAlg2:
        resultWithCusAccept.tasks[resultWithCusAccept.anchorTask]['name'],
      listNameToRemove: 'Refund Customer',
      parentName: '',
      childName: '',
      parent: '',
      parentId: '',
      child: '',
      childId: '',
    };
    for (const currentTask in resultWithCusAccept.tasks) {
      if (currentTask === resultWithCusAccept.anchorTask) {
        foundAnchor = true;
        continue;
      }
      if (!foundAnchor) continue;

      let counter = 0;
      let foundCurrentTask = false;
      for (const loop2task in resultWithCusAccept.tasks) {
        if (loop2task === currentTask) {
          foundCurrentTask = true;
          continue;
        }
        if (!foundCurrentTask) {
          continue;
        } else {
          counter++;
        }
        if (counter < 2) continue;

        const preLoop2Task = [...resultWithCusAccept.tasks[loop2task]['pre']];
        const postCurrentTask = [
          ...resultWithCusAccept.tasks[currentTask]['post'],
        ];

        const preLoop2ISExistInPostCurrent = preLoop2Task.every((value) =>
          postCurrentTask.includes(value),
        );
        if (preLoop2ISExistInPostCurrent) {
          result.parent = currentTask;
          result.parentId = resultWithCusAccept.tasks[currentTask]['id'];
          result.parentName = resultWithCusAccept.tasks[currentTask]['name'];
          result.child = loop2task;
          result.childId = resultWithCusAccept.tasks[loop2task]['id'];
          result.childName = resultWithCusAccept.tasks[loop2task]['name'];
          break;
        }
      }
      if (!!result.parent && !!result.child) break;
    }

    /* ------------------ Create BPMN diagram changed position ------------------ */
    if (!!result.parentId && !!result.childId) {
      await this.changePositionTask(
        dto.businessProcessId,
        resultWithCusAccept.anchorTaskId,
        result.parentId,
        result.childId,
      );
    }

    console.log({ 
      result: "Ket qua giai thuat 2:",  
      index: resultWithCusAccept.anchorTask,
      destiny: result.parent,
      move: result.child,
      task: JSON.stringify(resultWithCusAccept.tasks)
    })
    /* ------------------------------ Return result ----------------------------- */
    console.log({result});
    return result;
   
  }

  async removePositionTask(
    businessProcessId: number,
    anchorId: string,
    beRemovedId: string,
  ) {
    /* -------------------------- Find business process ------------------------- */
    const bp = await this.prisma.businessProcess.findUnique({
      where: { id: businessProcessId },
    });

    /* ---------------------------- Read BPMN diagram --------------------------- */
    const cwd = process.cwd();
    const fileString = readFileSync(`${cwd}/${bp.fileBPMNPath}`, 'utf8');

    /* ------------------------ Parse xml string to json ------------------------ */
    const parser = new Parser();
    const json = await parser.parseStringPromise(fileString);
    const listShapes =
      json['bpmn:definitions']['bpmndi:BPMNDiagram'][0]['bpmndi:BPMNPlane'][0][
        'bpmndi:BPMNShape'
      ];

    /* ----------------- Find anchor task and color it with pink ---------------- */
    const anchorTask = listShapes.find((s) => {
      return s['$']['bpmnElement'] === anchorId;
    });
    anchorTask['$']['bioc:fill'] = 'rgb(255, 205, 210)';

    /* -------------- Find task to be removed and color it with red ------------- */
    const removedTask = listShapes.find((s) => {
      return s['$']['bpmnElement'] === beRemovedId;
    });
    removedTask['$']['bioc:stroke'] = 'rgb(139, 0, 0)';
    // removedTask['$']['bioc:fill'] = 'rgb(255, 205, 210)';

    /* ------------------------ Convert json back to xml ------------------------ */
    const builder = new Builder();
    const xml = builder.buildObject(json);

    /* ------------------------------ Store new xml ----------------------------- */
    writeFileSync(`${cwd}/uploads/bpmn-after-remove-${bp.id}.bpmn`, xml);
    await this.prisma.businessProcess.update({
      where: { id: businessProcessId },
      data: {
        fileBPMNAfterRemovePath: `uploads/bpmn-after-remove-${bp.id}.bpmn`,
      },
    });

    return xml;
  }

  async changePositionTask(
    businessProcessId: number,
    anchorId: string,
    destinyId: string,
    beMovedId: string,
  ) {
    /* -------------------------- Find business process ------------------------- */
    const bp = await this.prisma.businessProcess.findUnique({
      where: { id: businessProcessId },
    });

    /* ---------------------------- Read BPMN diagram --------------------------- */
    const cwd = process.cwd();
    const fileString = readFileSync(
      `${cwd}/${bp.fileBPMNAfterRemovePath}`,
      'utf8',
    );

    /* ------------------------ Parse xml string to json ------------------------ */
    const parser = new Parser();
    const json = await parser.parseStringPromise(fileString);
    const listShapes =
      json['bpmn:definitions']['bpmndi:BPMNDiagram'][0]['bpmndi:BPMNPlane'][0][
        'bpmndi:BPMNShape'
      ];

    /* ----------------- Find anchor task and color it with pink ---------------- */
    const anchorTask = listShapes.find((s) => {
      return s['$']['bpmnElement'] === anchorId;
    });
    anchorTask['$']['bioc:fill'] = 'rgb(255, 205, 210)';

    /* ---------------- Find destiny task and color it with blue ---------------- */
    const destinyTask = listShapes.find((s) => {
      return s['$']['bpmnElement'] === destinyId;
    });
    destinyTask['$']['bioc:stroke'] = 'rgb(0, 0, 255)';
    // destinyTask['$']['bioc:fill'] = 'rgb(255, 205, 210)';

    /* ------------- Find to be moved task and color it with yellow ------------- */
    const beMovedTask = listShapes.find((s) => {
      return s['$']['bpmnElement'] === beMovedId;
    });
    beMovedTask['$']['bioc:stroke'] = 'rgb(2, 99, 39)';
    // beMovedTask['$']['bioc:fill'] = 'rgb(255, 205, 210)';

    /* ------------------------ Convert json back to xml ------------------------ */
    const builder = new Builder();
    const xml = builder.buildObject(json);

    /* ------------------------------ Store new xml ----------------------------- */
    writeFileSync(`${cwd}/uploads/bpmn-after-move-${bp.id}.bpmn`, xml);
    await this.prisma.businessProcess.update({
      where: { id: businessProcessId },
      data: { fileBPMNAfterMovePath: `uploads/bpmn-after-move-${bp.id}.bpmn` },
    });
    return xml;
  }

  async handleConfirmBP(userId: number, dto: ConfirmBPDto) {
    const cwd = process.cwd();
    const fileName = `${cwd}/uploads/redesigned-of-bpmn-${dto.businessProcessId}.bpmn`;
    if (existsSync(fileName)) {
      removeSync(fileName);
    }
    writeFileSync(fileName, unescape(dto.xml));

    const originBP = await this.prisma.businessProcess.findUnique({
      where: { id: dto.businessProcessId },
    });

    /* ----------------------- Create new Business Process ---------------------- */
    const newBusinessProcess = await this.prisma.businessProcess.create({
      data: {
        userId,
        name: `${originBP.name} tái thiết kế`,
        fileTaskPath: originBP.fileTaskAfterRemovePath,
        fileTaskName: originBP.fileTaskName,
        fileBPMNPath: `uploads/redesigned-of-bpmn-${dto.businessProcessId}.bpmn`,
        fileBPMNName: originBP.fileBPMNName,
        topic: originBP.topic,
      },
    });

    /* ------------------------- Create tasks for new BP ------------------------ */
    const fileTaskString = readFileSync(
      `${cwd}/${originBP.fileTaskAfterRemovePath}`,
      'utf8',
    );
    const taskJson = JSON.parse(fileTaskString);
    for (const index in taskJson) {
      await this.prisma.task.create({
        data: {
          name: taskJson[index]['name'],
          businessProcessId: newBusinessProcess.id,
        },
      });
    }

    return newBusinessProcess;
  }

  async updateBusinessProcessTasks(tasks: Task[]) {
    for (const task of tasks) {
      await this.prisma.task.update({
        where: { id: task.id },
        data: {
          time: task.time,
        },
      });
    }
    return true;
  }

  getTasks(bpId: number) {
    return this.prisma.task.findMany({
      where: { businessProcessId: bpId },
      orderBy: { id: 'asc' },
    });
  }
}
