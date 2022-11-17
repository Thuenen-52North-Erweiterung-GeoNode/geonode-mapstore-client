import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createPlugin } from "@mapstore/framework/utils/PluginsUtils";

import GroupTitle from "@mapstore/framework/components/TOC/fragments/GroupTitle";
import GroupChildren from "@mapstore/framework/components/TOC/fragments/GroupChildren";
import { updateNode } from "@mapstore/framework/actions/layers";

import { layerSelector } from "../selectors/layersSelector";

function LineBreaker(props) {
  const defaultLayers = document.getElementsByClassName(
    "toc-default-layer-head"
  );
  const groupLayers = document.getElementsByClassName("toc-default-group-head");
  const title = document.getElementsByClassName("toc-title");
  const groupTitle = document.getElementsByClassName("toc-group-title");
  const [layerGroupOpen, toggleLayerGroup] = useState(false);
  useEffect(() => {
    if (
      defaultLayers &&
      defaultLayers.length > 0 &&
      title &&
      title.length > 0 &&
      groupLayers &&
      groupLayers.length > 0 &&
      groupTitle &&
      groupTitle.length > 0
    ) {
      Object.entries(defaultLayers).forEach((element) => {
        element[1].style.height = "auto";
        element[1].style.display = "flow-root";
      });
      Object.entries(groupLayers).forEach((element) => {
        element[1].style.height = "auto";
        element[1].style.display = "flow-root";
      });
      Object.entries(title).forEach((element) => {
        element[1].style.wordBreak = "normal";
        element[1].style.overflowWrap = "anywhere";
        element[1].style.hyphens = "auto";
        element[1].style.height = "fit-content";
        element[1].style.width = "65%";
        element[1].style.maxWidth = "100%";
        element[1].style.whiteSpace = "normal";
      });
      Object.entries(groupTitle).forEach((element) => {
        element[1].style.wordBreak = "normal";
        element[1].style.overflowWrap = "anywhere";
        element[1].style.hyphens = "auto";
        element[1].style.height = "fit-content";
        element[1].style.width = "65%";
        element[1].style.maxWidth = "100%";
        element[1].style.whiteSpace = "normal";
      });
    }
  }, [layerGroupOpen]);

  GroupTitle.propTypes.onClick = () => {
    toggleLayerGroup(!layerGroupOpen);
  };

  const [toggleTooltip, toggleTooltipDeactivator] = useState(true);

  useEffect(() => {
    if (props.layers.length > 0) {
      props.layers.forEach((element) => {
        if (element.tooltipOptions != "none") {
          props.deactivateTooltipOptions(element.id, "layer", {
            tooltipOptions: "none",
          });
        }
      });
    }
  }, [toggleTooltip]);

  GroupChildren.propTypes.onSort = () => {
    toggleTooltipDeactivator(!toggleTooltip);
  };

  return <div></div>;
}

const LineBreakerPlugin = connect(
  (state) => ({
    layers: layerSelector(state),
  }),
  {
    deactivateTooltipOptions: updateNode,
  }
)(LineBreaker);

export default createPlugin("LayerTitleTocLineBreaker", {
  component: LineBreakerPlugin,
});
