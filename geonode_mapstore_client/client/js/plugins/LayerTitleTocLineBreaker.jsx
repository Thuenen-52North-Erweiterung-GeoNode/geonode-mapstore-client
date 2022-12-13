import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createPlugin } from "@mapstore/framework/utils/PluginsUtils";

import GroupTitle from "@mapstore/framework/components/TOC/fragments/GroupTitle";
import GroupChildren from "@mapstore/framework/components/TOC/fragments/GroupChildren";
import { updateNode } from "@mapstore/framework/actions/layers";

import { layerSelector } from "../selectors/layersSelector";

function LineBreaker(props) {
  const defaultLayers = document.getElementsByClassName("toc-default-layer-head");
  const groupLayers = document.getElementsByClassName("toc-default-group-head");
  const titles = document.getElementsByClassName("toc-title");
  const groupTitles = document.getElementsByClassName("toc-group-title");
  const [layerGroupOpen, toggleLayerGroup] = useState(false);

  const applyNewBlockFormatOn = (tocItems = []) => {
    Object.entries(tocItems).forEach((item) => {
      item[1].style.height = "auto";
      item[1].style.display = "flow-root";
    });
  }

  const enableLineBreakOn = (titles = []) => {
    Object.entries(titles).forEach((title) => {
      title[1].style.wordBreak = "normal";
      title[1].style.overflowWrap = "anywhere";
      title[1].style.hyphens = "auto";
      title[1].style.height = "fit-content";
      title[1].style.width = "65%";
      title[1].style.maxWidth = "100%";
      title[1].style.whiteSpace = "normal";
    });
  }

  useEffect(() => {
    applyNewBlockFormatOn(defaultLayers);
    applyNewBlockFormatOn(groupLayers);
    enableLineBreakOn(titles);
    enableLineBreakOn(groupTitles);

  }, [layerGroupOpen]);

  GroupTitle.propTypes.onClick = () => {
    toggleLayerGroup(!layerGroupOpen);
  };

  const [toggleTooltip, tooltipChanger] = useState(true);

  useEffect(() => {
    if (props.layers.length > 0) {
      props.layers.forEach((element) => {

        if (element.tooltipOptions === undefined) {
          props.setTooltipToDescription(element.id, "layer", {
            tooltipOptions: "description",
          });
        }
      });
    }
  }, [toggleTooltip]);

  GroupChildren.propTypes.onSort = () => {
    tooltipChanger(!toggleTooltip);
  };

  return <div></div>;
}

const LineBreakerPlugin = connect(
  (state) => ({
    layers: layerSelector(state),
  }),
  {
    setTooltipToDescription: updateNode,
  }
)(LineBreaker);

export default createPlugin("LayerTitleTocLineBreaker", {
  component: LineBreakerPlugin,
});
