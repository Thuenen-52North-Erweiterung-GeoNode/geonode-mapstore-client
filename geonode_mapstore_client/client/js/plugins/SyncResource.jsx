import React from "react";
import { createPlugin } from "../../MapStore2/web/client/utils/PluginsUtils";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import Message from "../../MapStore2/web/client/components/I18N/Message";
import Button from "../components/Button/Button";
import ResizableModal from "../../MapStore2/web/client/components/misc/ResizableModal";
import Portal from "../../MapStore2/web/client/components/misc/Portal";

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
