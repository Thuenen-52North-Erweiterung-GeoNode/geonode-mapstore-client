import React from "react";
import { connect, createPlugin } from "@mapstore/framework/utils/PluginsUtils";
import { get } from "lodash";
import { Glyphicon, Tooltip } from "react-bootstrap";

import ResizableModal from "@mapstore/framework/components/misc/ResizableModal";
import WMSLegend from "@mapstore/framework/components/TOC/fragments/WMSLegend";
import OverlayTrigger from "@mapstore/framework/components/misc/OverlayTrigger";
import Button from "../../MapStore2/web/client/components/misc/Button";
import Message from "@mapstore/framework/components/I18N/Message";

import { layerSelector, getStyleeditor } from "../selectors/layersSelectors";
import "./collectiveLegend/collectiveLegend.css";
import { updateCollectiveLegend, updateLegendPosition } from "@mapstore/framework/actions/map";

/**
 * Plugin for CollectiveLegend
 * @name CollectiveLegend
 * @memberof plugins
 */

function CollectiveLegendModal(props) {
   /*const windowX = mapContainer.clientWidth-legendSizes.width;
  const windowY = windowSizes.height;
  const xratio = legendSizes.left/windowX;
  const yratio = legendSizes.top/windowY;*/

  let x, y;
  if ( props && props.legendPosition ) {
    const mapContainer = document.getElementById("ms-container");
    const windowSizes = mapContainer.getBoundingClientRect();
    const legend = props.legendPosition.legend;
    const oldWindow = props.legendPosition.window

    const windowX = windowSizes.width-legend.width; 
    x = legend.x/(oldWindow.width - legend.width) * windowX - windowX/2;
    
    const windowY = windowSizes.height-legend.height; 
    const windowYSpanBottomTop = windowY
    let ytemp1 = (legend.y/(oldWindow.height-legend.height)) 
    let ytemp2 = ytemp1 * windowYSpanBottomTop;
    y = ytemp2 - windowYSpanBottomTop/2;
  } else {
    x = 0; 
    y = 0;
  }


  return props.collectiveLegend && props.layers ? (
    <React.Fragment className="modal">
      {
        <ResizableModal
          title="Gemeinsame Legende aller sichtbarer Layer"
          show={open}
          onClose={() => props.saveLegend(!props.collectiveLegend)}
          draggable={true}
          clickOutEnabled={false}
          modal={true}
          fitContent={true}
          dialogClassName={"floaty"}
          handleDrag={() => handleDrag(props)}
          start={{x:x, y:y}}
        >
          <div className="collectiveLegendModal">
            {props.layers.length > 0
              ? props.layers.reverse().map((layer) =>
                  layer.visibility ? (
                    <div className="legendLayer">
                      {props.styleeditor && props.styleeditor.service ? (
                        <StyleInformation
                          layer={layer}
                          editor={props.styleeditor}
                        />
                      ) : null}
                      <WMSLegend node={layer} />
                    </div>
                  ) : null
                )
              : null}
            <div className="closeButton">
              <Button onClick={() => props.saveLegend(!props.collectiveLegend)}>
                {<Message msgId="close" />}
              </Button>
            </div>
          </div>
        </ResizableModal>
      }
    </React.Fragment>
  ) : null;
}

const handleDrag = (props) => {
  const mapContainer = document.getElementById("ms-container");
  const legendModal = document.getElementById("ms-resizable-modal");   
  const legendSizes = legendModal.getBoundingClientRect();
  const windowSizes = mapContainer.getBoundingClientRect();
  const position = {
    legend: legendSizes,
    window: windowSizes,
  }
  props.saveLegendPosition(position);
}

function StyleInformation(props) {
  const layer = props.layer;
  return (
    <div>
      <p>
        <b>{layer.title}</b>
      </p>
      <p>{layer.description}</p>
    </div>
  );
}

const CollectiveLegendConnector = connect(
  (state) => ({
    layers: layerSelector(state),
    collectiveLegend: get(state, "map.present.collectiveLegend"),
    legendPosition: get(state, "map.present.legendPosition"),
    styleeditor: getStyleeditor(state),
  }),
  {
    saveLegend: updateCollectiveLegend,
    saveLegendPosition: updateLegendPosition,
  }
)(CollectiveLegendModal);

function CollectiveLegendButton(props) {
  function handleClick() {
    props.saveLegend(!props.collectiveLegend);
  }

  return props && props.collectiveLegend ? (
    <OverlayTrigger
      key="collectiveLegend"
      placement="top"
      overlay={
        <Tooltip id="toc-tooltip-collectiveLegend">
          Hide collective legend
        </Tooltip>
      }
    >
      <Button
        key="collectiveLegend"
        bsStyle="success"
        className="square-button-md"
        onClick={handleClick}
      >
        <Glyphicon glyph="list-alt" />
      </Button>
    </OverlayTrigger>
  ) : (
    <OverlayTrigger
      key="collectiveLegend"
      placement="top"
      overlay={
        <Tooltip id="toc-tooltip-collectiveLegend">
          Show collective legend
        </Tooltip>
      }
    >
      <Button
        key="collectiveLegend"
        bsStyle="primary"
        className="square-button-md"
        onClick={handleClick}
      >
        <Glyphicon glyph="list-alt" />
      </Button>
    </OverlayTrigger>
  );
}

const CollectiveLegendButtonConnector = connect(
  (state) => ({
    collectiveLegend: get(state, "map.present.collectiveLegend"),
  }),
  {
    saveLegend: updateCollectiveLegend,
  }
)(CollectiveLegendButton);

export default createPlugin("CollectiveLegend", {
  component: CollectiveLegendConnector,
  containers: {
    TOC: {
      target: "toolbar",
      Component: CollectiveLegendButtonConnector,
    },
  },
});
