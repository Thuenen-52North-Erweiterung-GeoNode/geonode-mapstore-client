import React, {useEffect, useState, useCallback} from 'react';
import { connect, createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import {get} from 'lodash';

import ResizableModal from '@mapstore/framework/components/misc/ResizableModal';
import WMSLegend from '@mapstore/framework/components/TOC/fragments/WMSLegend';
import { Glyphicon, Tooltip } from 'react-bootstrap';
import OverlayTrigger from '@mapstore/framework/components/misc/OverlayTrigger';
import Button from '../../MapStore2/web/client/components/misc/Button';
import Message from '@mapstore/framework/components/I18N/Message';

import { layerSelector, getStyleeditor } from '../selectors/layersSelector';
import { toggleCollectiveLegend } from './collectiveLegend/collectiveLegendAction';
import collectiveLegend from './collectiveLegend/collectiveLegendReducer';
import './collectiveLegend/collectiveLegend.css';
import { getStyleCodeByName } from '@mapstore/framework/api/geoserver/Styles';

/**
 * Plugin for CollectiveLegend
 * @name CollectiveLegend
 * @class
 * @memberof plugins
 * @example
 */

function CollectiveLegendModal(props) {
    return ( 
        props.collectiveLegend ? 
            <React.Fragment>
                {
                    <ResizableModal
                        title="Legend"
                        show={open} 
                        onClose={()=>props.toggleLegend(false)}
                        draggable={true}
                        clickOutEnabled={false}
                        modal={true}
                        fitContent={true}
                    >
                        <div className='collectiveLegendModal'>
                            <h1 style={{marginBottom: "5%"}}><b> Collective Legend of visible layers </b></h1>
                            {props.layers && props.layers.length > 0 ? 
                                (props.layers.reverse().map((layer)=> (
                                    layer.visibility ?
                                    <div style = {{marginBottom:"5%"}}>
                                        <p><b>Layer:</b> {layer.title}</p>
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
                                <Button onClick={()=>props.toggleLegend(false)}>
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
    if (props.editor.service) {
        
    const [posts, setPosts] = useState([]);
    useEffect(()=>{
        getStyleCodeByName({
            baseUrl: props.editor.service.baseUrl,
            styleName: props.layer.name,
        }).then((style) => {
            
            if (style.code) {
                const parsedStyleCode = new DOMParser().parseFromString(style.code, "text/xml");
                let title = "";
                if ( parsedStyleCode.querySelectorAll("Title")[0] ) {
                    title = parsedStyleCode.querySelectorAll("Title")[0].textContent;
                }
                setPosts(title);
            }
        })
    })
    return(
        <div>
            <p>Style title: {posts}</p>
            <p>Style description</p>
        </div>
    )} else {
        return <div>Nein</div>;
    }
};

const CollectiveLegendConnector = connect(
    (state) => ({
        layers: layerSelector(state),
        collectiveLegend: get(state, 'collectiveLegend.collectiveLegend'),
        styleeditor: getStyleeditor(state),
    }),{
        toggleLegend: toggleCollectiveLegend,
    })(CollectiveLegendModal);

function CollectiveLegendButton(props) {

    function handleClick() {
        props.toggleLegend(!props.collectiveLegend)
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
        collectiveLegend: get(state, 'collectiveLegend.collectiveLegend'),
    }),{
        toggleLegend: toggleCollectiveLegend,
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
