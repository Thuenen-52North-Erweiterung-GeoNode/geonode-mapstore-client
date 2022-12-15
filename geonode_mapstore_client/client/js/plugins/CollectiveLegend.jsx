import React, {useEffect, useState, useCallback} from 'react';
import { connect, createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { get } from 'lodash';
import { Glyphicon, Tooltip } from 'react-bootstrap';

import ResizableModal from '@mapstore/framework/components/misc/ResizableModal';
import WMSLegend from '@mapstore/framework/components/TOC/fragments/WMSLegend';
import OverlayTrigger from '@mapstore/framework/components/misc/OverlayTrigger';
import Button from '../../MapStore2/web/client/components/misc/Button';
import Message from '@mapstore/framework/components/I18N/Message';

import { layerSelector, getStyleeditor } from '../selectors/layersSelectors';
import { toggleCollectiveLegend } from './collectiveLegend/collectiveLegendAction';
import collectiveLegend from './collectiveLegend/collectiveLegendReducer';
import './collectiveLegend/collectiveLegend.css';
//import { getStyleCodeByName } from '@mapstore/framework/api/geoserver/Styles'; Only needed if style information is needed, see commented code below
import { updateCollectiveLegend } from '@mapstore/framework/actions/map';

/**
 * Plugin for CollectiveLegend
 * @name CollectiveLegend
 * @class
 * @memberof plugins
 * @example
 */

function CollectiveLegendModal(props) {
    return ( 
        props.collectiveLegend && props.layers ? 
            <React.Fragment>
                {
                    <ResizableModal
                        className="modal"
                        title="Gemeinsame Legende aller sichbarer Layer"
                        show={open} 
                        onClose={() => props.toggleLegend(false)}
                        draggable={true}
                        clickOutEnabled={false}
                        modal={true}
                        fitContent={true}
                    >
                        <div className='collectiveLegendModal'>
                            {props.layers.length > 0 ? 
                                (props.layers.reverse().map((layer)=> (
                                    layer.visibility ?
                                    <div className='legendLayer'>
                                        {props.styleeditor && props.styleeditor.service ?
                                        <StyleInformation layer={layer} editor={props.styleeditor} /> : null
                                        }
                                        <WMSLegend node={layer} />
                                    </div>
                                    : null
                                    )
                                ))
                            : null}
                            <div className='closeButton'>
                                <Button onClick={ () => props.toggleLegend(false)}>
                                    {<Message msgId="close"/>}
                                </Button>
                            </div>
                        </div>
                    </ResizableModal>
                }
            </React.Fragment> : null
        );
    }

function StyleInformation(props) {
    const layer = props.layer;
    return(
        <div>
            <p><b>{layer.title}</b></p>
            <p>{layer.description}</p>
        </div>)
    /*if (props.editor.service) {
        const [styleInfo, setStyleInfo] = useState([]);
        useEffect(()=>{
            getStyleCodeByName({
                baseUrl: props.editor.service.baseUrl,
                styleName: props.layer.name,
            }).then((style) => {
                if (style.code) {
                    const parsedStyleCode = new DOMParser().parseFromString(style.code, "text/xml");
                    let title = "";
                    let abstract = "";
                    if ( parsedStyleCode.querySelectorAll("Title")[0] ) {
                        title = parsedStyleCode.querySelectorAll("Title")[0].textContent;
                    }
                    if ( parsedStyleCode.querySelectorAll("Abstract")[0] ) {
                        abstract = parsedStyleCode.querySelectorAll("Abstract")[0].textContent;
                    }
                    setStyleInfo({
                        "title": title,
                        "abstract": abstract,
                    });
                }
            })
        })
        return(
            <div>
                <p><b>Style title:</b> {styleInfo.title}</p>
                <p><b>Style description:</b> {styleInfo.abstract}</p>
            </div>
    )} else {
        return null;
    }*/
};

const CollectiveLegendConnector = connect(
    (state) => ({
        layers: layerSelector(state),
        //collectiveLegend: get(state, 'collectiveLegend.collectiveLegend'),
        collectiveLegend: get(state, 'map.present.collectiveLegend'),
        styleeditor: getStyleeditor(state),
    }),{
        toggleLegend: toggleCollectiveLegend,
    })(CollectiveLegendModal);

function CollectiveLegendButton(props) {

    function handleClick() {
        props.toggleLegend(!props.collectiveLegend);
        props.saveLegend(!props.collectiveLegend);
    }
    
    return (
        props && props.collectiveLegend ?
            <OverlayTrigger
                key="collectiveLegend"
                placement="top"
                overlay={<Tooltip id="toc-tooltip-collectiveLegend">Hide collective legend</Tooltip>}>
                <Button 
                    key="collectiveLegend" bsStyle="success" className="square-button-md" onClick={handleClick}>
                    <Glyphicon glyph="list-alt" />
                </Button>
            </OverlayTrigger> :
            <OverlayTrigger
                key="collectiveLegend"
                placement="top"
                overlay={<Tooltip id="toc-tooltip-collectiveLegend">Show collective legend</Tooltip>}>
                <Button 
                    key="collectiveLegend" bsStyle="primary" className="square-button-md" onClick={handleClick}>
                    <Glyphicon glyph="list-alt" />
                </Button>
            </OverlayTrigger>
        );
    }

const CollectiveLegendButtonConnector = connect(
    (state) => ({
        //collectiveLegend: get(state, 'collectiveLegend.collectiveLegend'),
        collectiveLegend: get(state, 'map.present.collectiveLegend'),
    }),{
        toggleLegend: toggleCollectiveLegend,
        saveLegend: updateCollectiveLegend,
})(CollectiveLegendButton);

export default createPlugin('CollectiveLegend', {
    component: CollectiveLegendConnector,
    containers: {
        TOC: {
            target: 'toolbar',
            Component: CollectiveLegendButtonConnector,
        }
    },
    reducers: {
        collectiveLegend,
    }
});
