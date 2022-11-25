/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createPlugin } from "@mapstore/framework/utils/PluginsUtils";

console.log("hallo maggus");

function LayerStyleSelect(props) {
  console.log("test");
  return <div></div>;
}

export default createPlugin("LayerStyleSelect", {
  component: LayerStyleSelect,
});
