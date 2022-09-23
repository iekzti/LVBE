import Modeler from "bpmn-js/lib/Modeler";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

import { useEffect, useRef, useState } from "react";
import { baseXml } from "./utils/baseXml";

function App() {
  const containerRef = useRef(null);
  const downloadLinkRef = useRef(null);
  const [modeler, setModeler] = useState();
  const [file, setFile] = useState();

  const handleUploadFile = (e) => {
    setFile(e.target.files[0]);
  };

  const renderDiagram = () => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = async e => {
      let xml = e.target.result;
      try  {
        await modeler.importXML(xml);
        const canvas = modeler.get("canvas");
        canvas.zoom("fit-viewport", "auto");
      } catch (err) {
        console.log(err);
      }
    }
  }

  const setEncoded = (link, name, data) => {
    var encodedData = encodeURIComponent(data.xml);
    if (data) {
      link.setAttribute('href', 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData);
      link.setAttribute('download', name);
    }
  }

  const saveBpmn = () => {
    modeler.saveXML({ format: true }).then((xml, err) => 
      {
        setEncoded(downloadLinkRef.current, 'diagram.bpmn', err ? null : xml);
      }
    );
  }

  useEffect(() => {
    const container = containerRef.current;
    const modeler = new Modeler({
      container,
      keyboard: {
        bindTo: document,
      },
    });
    async function defailtModel() {
      setModeler(modeler);
      try {
        await modeler.importXML(baseXml);
        const canvas = modeler.get("canvas");
        canvas.zoom("fit-viewport", "auto");
      } catch(err) {
        console.log(err);
      }
    }

    defailtModel();
  }, []);

  useEffect(() => {
    file && renderDiagram();
  }, [file]);

  return (
    <div>
      <div>
        <input
          type="file"
          onChange={handleUploadFile}
        />
        <a onClick={saveBpmn} href="/" ref={downloadLinkRef}>Export</a>
      </div>
      <div ref={containerRef} style={{ width: "100%", height: "100vh", background:"blue" }}></div>
    </div>
  );
}

export default App;
