import React, { useState, useEffect } from "react";
import { FormGroup, ControlLabel } from "react-bootstrap";
import Message from "@mapstore/framework/components/I18N/Message";
import Select from "react-select";
import { getCapabilities } from "@mapstore/framework/api/WMS";
import axios from "@mapstore/framework/libs/ajax";

/* function parseXmlToJson(xml) {
  //https://stackoverflow.com/questions/1773550/convert-xml-to-json-and-back-using-javascript
  const json = {};
  for (const res of xml.matchAll(
    /(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm
  )) {
    const key = res[1] || res[3];
    const value = res[2] && parseXmlToJson(res[2]);
    json[key] = (value && Object.keys(value).length ? value : res[2]) || null;
  }
  return json;
} */

//const parser = require("xml2json");

function FindLayerStyle(props) {
  console.log(props);
  const [gC, setgC] = useState([]);

  const cap = axios
    .get(props.node.url + "request=GetCapabilities")
    .then((response) => {
      return setgC(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

  console.log(gC);

  return (
    <FormGroup>
      <Select key="select-style" />
    </FormGroup>
  );
}
export default FindLayerStyle;
