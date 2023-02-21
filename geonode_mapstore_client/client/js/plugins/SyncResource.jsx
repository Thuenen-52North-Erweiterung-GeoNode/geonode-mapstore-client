/* import React from "react";
import { createPlugin } from "../../MapStore2/web/client/utils/PluginsUtils";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import Message from "../../MapStore2/web/client/components/I18N/Message";
import Button from "../components/Button/Button";
import ResizableModal from "../../MapStore2/web/client/components/misc/ResizableModal";
import Portal from "../../MapStore2/web/client/components/misc/Portal"; */
import React from 'react';
import { createPlugin } from '@mapstore/framework/utils/PluginsUtils';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Message from '@mapstore/framework/components/I18N/Message';
import Button from '@js/components/Button';
import ResizableModal from '@mapstore/framework/components/misc/ResizableModal';
import Portal from '@mapstore/framework/components/misc/Portal';
import { setControlProperty } from '@mapstore/framework/actions/controls';
import { getResourceData } from '@js/selectors/resource';
import { processResources } from '@js/actions/gnresource';
import ResourceCard from '@js/components/ResourceCard';
import { ProcessTypes } from '@js/utils/ResourceServiceUtils';
import Loader from '@mapstore/framework/components/misc/Loader';


function SyncResourcePlugin({
  enabled,
  resources = [],
  onClose = () => {},
  onSync = () => {},
  loading,
}) {
  console.log("finger");
  return (
    <Portal>
      <ResizableModal
        title={"test"}
        show={enabled}
        fitContent
        clickOutEnabled
        buttons={
          loading
            ? []
            : [
                {
                  text: (
                    <Message
                      msgId="gnviewer.deleteResourceNo"
                      msgParams={{ count: resources.length }}
                    />
                  ),
                  onClick: () => onClose(),
                },
                {
                  text: (
                    <Message
                      msgId="gnviewer.deleteResourceYes"
                      msgParams={{ count: resources.length }}
                    />
                  ),
                  bsStyle: "danger",
                  onClick: () => onSync(resources, redirectTo),
                },
              ]
        }
        onClose={loading ? null : () => onClose()}
      >
        ACHTUNG ACHTUNG

        <ul
                    className="gn-card-grid"
                    style={{
                        listStyleType: 'none',
                        padding: '0.5rem',
                        margin: 0
                    }}
                >
                    {resources.map((data, idx) => {
                        return (
                            <li style={{ padding: '0.25rem 0' }} key={data.pk + '-' + idx}>
                                <ResourceCard data={data} layoutCardsStyle="list" readOnly/>
                            </li>
                        );
                    })}
                </ul>
                {loading && <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Loader size={70}/>
                </div>}
      </ResizableModal>
    </Portal>
  );
}

const ConnectedSyncResourcePlugin = connect(
  createSelector(
    [
      (state) => state?.controls?.[ProcessTypes.SYNC_RESOURCE]?.value,
      (state) => state?.controls?.[ProcessTypes.SYNC_RESOURCE]?.loading,
    ],
    (resources, loading) => ({
      resources,
      enabled: !!resources,
      loading,
    })
  ),
  {
    onClose: setControlProperty.bind(
      null,
      ProcessTypes.SYNC_RESOURCE,
      "value",
      undefined
    ),
    onSync: processResources.bind(null, ProcessTypes.SYNC_RESOURCE),
  }
)(SyncResourcePlugin);

const SyncButton = ({ onClick, size, resource }) => {
  const handleClickButton = () => {
    onClick([resource]);
  };

  return (
    <Button variant="danger" size={size} onClick={handleClickButton}>
      syncisieren bitte
    </Button>
  );
};

const ConnectedSyncButton = connect(
  createSelector([getResourceData], (resource) => ({
    resource,
  })),
  {
    onClick: setControlProperty.bind(null, ProcessTypes.SYNC_RESOURCE, "value"),
  }
)(SyncButton);

export default createPlugin("SyncResource", {
  component: ConnectedSyncResourcePlugin,
  containers: {
    ActionNavbar: {
      name: "SyncResource",
      Component: ConnectedSyncButton,
    },
  },
  epics: {},
  reducers: {},
});
