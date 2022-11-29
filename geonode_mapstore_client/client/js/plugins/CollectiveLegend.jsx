import React, { useState } from 'react';
import { connect, createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { Glyphicon, Tooltip } from 'react-bootstrap';
import ResizableModal from '@mapstore/framework/components/misc/ResizableModal';
import OverlayTrigger from '@mapstore/framework/components/misc/OverlayTrigger';
import {get} from 'lodash';

import Button from '../../MapStore2/web/client/components/misc/Button';
import Message from '@mapstore/framework/components/I18N/Message';
import { layerSelector } from '../selectors/layersSelector';
import { toggleCollectiveLegend } from './collectiveLegend/collectiveLegendAction';
import collectiveLegend from './collectiveLegend/collectiveLegendReducer';

import './collectiveLegend/collectiveLegend.css';
import WMSLegend from '@mapstore/framework/components/TOC/fragments/WMSLegend';

/**
 * Plugin for CollectiveLegend
 * @name CollectiveLegend
 * @class
 * @memberof plugins
 * @example
 */

function CollectiveLegendModal(props) {
    //console.log(props)
    return ( 
        props.collectiveLegend ? 
        <React.Fragment>
            {
                <ResizableModal
                    title="Collective Legend"
                    show={open} 
                    onClose={()=>props.toggleLegend(false)}
                    draggable={true}
                    clickOutEnabled={false}
                    modal={true}
                >
                    <div className='collectiveLegendModal'>
                        <h1> HEADER </h1>
                        {props.layers && props.layers.length > 0 ? (props.layers.map((layer)=> (
                            layer.visibility ?
                            <WMSLegend node={layer} /> : null
                        ))) : null}
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

const CollectiveLegendConnector = connect(
    (state) => ({
        layers: layerSelector(state),
        collectiveLegend: get(state, 'collectiveLegend.collectiveLegend'),
    }),{
    toggleLegend: toggleCollectiveLegend,
    }
    )(CollectiveLegendModal);

function CollectiveLegendButton(props) {
    
    function handleClick() {
        props.toggleLegend(!props.collectiveLegend)
    }
    return (props && props.collectiveLegend ?
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
            Component: CollectiveLegendButtonConnector
        }
    },
    reducers: {
        collectiveLegend
    }
});
