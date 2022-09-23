export const baseXml = `<?xml version="1.0"?>
<definitions xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="_2022090704555" targetNamespace="http://www.bizagi.com/definitions/_2022090704555" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <process id="Id_a77e9019-520a-40b3-84aa-9140b31260d7" name="Process 1">
    <documentation />
    <laneSet id="Id_e7232ea6-9e62-4f54-9d50-c0ed15be1ec8" />
    <task id="Id_5d0dc591-4400-42f5-a16d-c056ff5da1e3" name="Task 1">
      <documentation />
      <extensionElements>
        <bizagi:BizagiExtensions xmlns:bizagi="http://www.bizagi.com/bpmn20">
          <bizagi:BizagiProperties>
            <bizagi:BizagiProperty name="bgColor" value="#ECEFFF" />
            <bizagi:BizagiProperty name="borderColor" value="#03689A" />
            <bizagi:BizagiProperty name="textColor" value="#000000" />
            <bizagi:BizagiProperty name="textBackgroundColor" value="#FFFFFF" />
            <bizagi:BizagiProperty name="textDirection" value="" />
          </bizagi:BizagiProperties>
        </bizagi:BizagiExtensions>
      </extensionElements>
      <incoming>Id_02ef5a59-a79f-4a79-93da-3998421af9c7</incoming>
      <outgoing>Id_88a3c795-dc81-4026-80c8-70ceb0b87e5d</outgoing>
    </task>
    <startEvent id="Id_51bab053-f5ca-454f-8497-56377e96130f" name="">
      <documentation />
      <extensionElements>
        <bizagi:BizagiExtensions xmlns:bizagi="http://www.bizagi.com/bpmn20">
          <bizagi:BizagiProperties>
            <bizagi:BizagiProperty name="bgColor" value="#E6FF97" />
            <bizagi:BizagiProperty name="borderColor" value="#62A716" />
            <bizagi:BizagiProperty name="textColor" value="#000000" />
            <bizagi:BizagiProperty name="textBackgroundColor" value="#FFFFFF" />
            <bizagi:BizagiProperty name="textDirection" value="" />
            <bizagi:BizagiProperty name="runtimeProperties" value="{}" />
          </bizagi:BizagiProperties>
        </bizagi:BizagiExtensions>
      </extensionElements>
      <outgoing>Id_02ef5a59-a79f-4a79-93da-3998421af9c7</outgoing>
    </startEvent>
    <endEvent id="Id_b470c8ed-f7fd-4a23-8947-c70854d3f68b">
      <extensionElements>
        <bizagi:BizagiExtensions xmlns:bizagi="http://www.bizagi.com/bpmn20">
          <bizagi:BizagiProperties>
            <bizagi:BizagiProperty name="bgColor" value="#EEAAAA" />
            <bizagi:BizagiProperty name="borderColor" value="#990000" />
            <bizagi:BizagiProperty name="textColor" value="Black" />
            <bizagi:BizagiProperty name="textBackgroundColor" value="White" />
            <bizagi:BizagiProperty name="textDirection" value="" />
          </bizagi:BizagiProperties>
        </bizagi:BizagiExtensions>
      </extensionElements>
      <incoming>Id_88a3c795-dc81-4026-80c8-70ceb0b87e5d</incoming>
    </endEvent>
    <sequenceFlow id="Id_02ef5a59-a79f-4a79-93da-3998421af9c7" sourceRef="Id_51bab053-f5ca-454f-8497-56377e96130f" targetRef="Id_5d0dc591-4400-42f5-a16d-c056ff5da1e3">
      <extensionElements>
        <bizagi:BizagiExtensions xmlns:bizagi="http://www.bizagi.com/bpmn20">
          <bizagi:BizagiProperties>
            <bizagi:BizagiProperty name="bgColor" value="White" />
            <bizagi:BizagiProperty name="borderColor" value="Black" />
            <bizagi:BizagiProperty name="textColor" value="Black" />
            <bizagi:BizagiProperty name="textBackgroundColor" value="White" />
            <bizagi:BizagiProperty name="textDirection" value="" />
          </bizagi:BizagiProperties>
        </bizagi:BizagiExtensions>
      </extensionElements>
    </sequenceFlow>
    <sequenceFlow id="Id_88a3c795-dc81-4026-80c8-70ceb0b87e5d" sourceRef="Id_5d0dc591-4400-42f5-a16d-c056ff5da1e3" targetRef="Id_b470c8ed-f7fd-4a23-8947-c70854d3f68b">
      <extensionElements>
        <bizagi:BizagiExtensions xmlns:bizagi="http://www.bizagi.com/bpmn20">
          <bizagi:BizagiProperties>
            <bizagi:BizagiProperty name="bgColor" value="White" />
            <bizagi:BizagiProperty name="borderColor" value="Black" />
            <bizagi:BizagiProperty name="textColor" value="Black" />
            <bizagi:BizagiProperty name="textBackgroundColor" value="White" />
            <bizagi:BizagiProperty name="textDirection" value="" />
          </bizagi:BizagiProperties>
        </bizagi:BizagiExtensions>
      </extensionElements>
    </sequenceFlow>
  </process>
  <collaboration id="Id_d703c872-ccc2-4a1f-ac2e-3dcf9ef66353" name="Diagram 1">
    <documentation />
    <participant id="Id_4ecc15a6-2486-40d1-8e36-f0da959cc1ad" name="Process 1" processRef="Id_a77e9019-520a-40b3-84aa-9140b31260d7">
      <documentation />
      <extensionElements>
        <bizagi:BizagiExtensions xmlns:bizagi="http://www.bizagi.com/bpmn20">
          <bizagi:BizagiProperties>
            <bizagi:BizagiProperty name="bgColor" value="#FFFFFF" />
            <bizagi:BizagiProperty name="borderColor" value="#000000" />
            <bizagi:BizagiProperty name="textColor" value="#000000" />
            <bizagi:BizagiProperty name="textBackgroundColor" value="#FFFFFF" />
            <bizagi:BizagiProperty name="textDirection" value="" />
          </bizagi:BizagiProperties>
        </bizagi:BizagiExtensions>
      </extensionElements>
    </participant>
  </collaboration>
  <BPMNDiagram id="Diagram_17af96b7-8ed1-4ed7-b170-27382223f4a5" xmlns="http://www.omg.org/spec/BPMN/20100524/DI">
    <BPMNPlane id="DiagramElement_95a93ac2-5d16-4ade-87c1-16ee43822b30" bpmnElement="Id_d703c872-ccc2-4a1f-ac2e-3dcf9ef66353">
      <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
      <BPMNShape id="DiagramElement_27fad56a-646d-44d1-a0bc-182df408864e" bpmnElement="Id_2dcdfcb3-2152-4906-81f1-314b30984836" isHorizontal="true">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <Bounds x="30" y="30" width="700" height="350" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
        <BPMNLabel id="DiagramElement_df64be48-849c-481d-9bb5-59b3c28e0f2a" labelStyle="Style_b94f34c8-c6c1-4cc2-a36c-9c7abd0ed921">
          <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
          <Bounds x="0" y="0" width="0" height="0" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
        </BPMNLabel>
      </BPMNShape>
      <BPMNShape id="DiagramElement_1e52db0e-a041-42ee-9a90-880ad05b1a98" bpmnElement="Id_4ecc15a6-2486-40d1-8e36-f0da959cc1ad" isHorizontal="true">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <Bounds x="30" y="30" width="700" height="350" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
        <BPMNLabel id="DiagramElement_58c09e18-d342-42b1-b5c8-e086f8817da1" labelStyle="Style_2efcd608-d89d-4ba9-8177-5a65e14950cd">
          <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
          <Bounds x="0" y="0" width="0" height="0" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
        </BPMNLabel>
      </BPMNShape>
      <BPMNShape id="DiagramElement_1ffe0a41-3f31-4ba9-824c-09dfe9fedc10" bpmnElement="Id_5d0dc591-4400-42f5-a16d-c056ff5da1e3">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <Bounds x="251" y="67" width="90" height="60" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
        <BPMNLabel id="DiagramElement_2da91d5b-5fef-429a-b669-a24e0ed11a6f" labelStyle="Style_f5a81e61-3702-4c54-9977-fe45bac20302">
          <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
          <Bounds x="0" y="0" width="90" height="60" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
        </BPMNLabel>
      </BPMNShape>
      <BPMNShape id="DiagramElement_d89d1bfe-5a6c-4534-92a9-485b694b5419" bpmnElement="Id_51bab053-f5ca-454f-8497-56377e96130f">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <Bounds x="100" y="82" width="30" height="30" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
      </BPMNShape>
      <BPMNShape id="DiagramElement_c6c6bd03-861b-4115-933f-5f4fc9335be0" bpmnElement="Id_b470c8ed-f7fd-4a23-8947-c70854d3f68b">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <Bounds x="451" y="82" width="30" height="30" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
      </BPMNShape>
      <BPMNEdge id="DiagramElement_ac925975-edca-4a85-9eee-c053b86d72d5" bpmnElement="Id_02ef5a59-a79f-4a79-93da-3998421af9c7">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <waypoint x="130" y="97" xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <waypoint x="251" y="97" xmlns="http://www.omg.org/spec/DD/20100524/DI" />
      </BPMNEdge>
      <BPMNEdge id="DiagramElement_02ec69cc-25b3-45a9-9df9-1796ea7b89b2" bpmnElement="Id_88a3c795-dc81-4026-80c8-70ceb0b87e5d">
        <extension xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <waypoint x="341" y="97" xmlns="http://www.omg.org/spec/DD/20100524/DI" />
        <waypoint x="451" y="97" xmlns="http://www.omg.org/spec/DD/20100524/DI" />
      </BPMNEdge>
    </BPMNPlane>
    <BPMNLabelStyle id="Style_b94f34c8-c6c1-4cc2-a36c-9c7abd0ed921">
      <Font name="Segoe UI" size="10" isBold="true" isItalic="false" isUnderline="false" isStrikeThrough="false" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
    </BPMNLabelStyle>
    <BPMNLabelStyle id="Style_2efcd608-d89d-4ba9-8177-5a65e14950cd">
      <Font name="Segoe UI" size="10" isBold="true" isItalic="false" isUnderline="false" isStrikeThrough="false" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
    </BPMNLabelStyle>
    <BPMNLabelStyle id="Style_f5a81e61-3702-4c54-9977-fe45bac20302">
      <Font name="Segoe UI" size="8" isBold="false" isItalic="false" isUnderline="false" isStrikeThrough="false" xmlns="http://www.omg.org/spec/DD/20100524/DC" />
    </BPMNLabelStyle>
  </BPMNDiagram>
</definitions>`;