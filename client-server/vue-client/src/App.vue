<script setup>
import { inject, ref, watch } from "vue"

const wsClient = inject("wsClient");
const resolution = ref(6);
const viewId = ref(null);

// Get the default viewId
wsClient.getRemote().Trame.getState().then((s) => {
    viewId.value = s.state.viewId;
});

// Update server with client resolution
watch(
    resolution,
    (value) => {
        wsClient.getRemote().Trame.updateState([
            { key: "resolution", value }
        ]);
    }
)

</script>

<template>
    <div style="width: 100vw; height: 100vh;">
        <vtk-remote-view
            v-if="viewId"
            :viewId="viewId"
            :wsClient="wsClient"
        />
        <input
            type="range"
            min="3"
            max="60"
            v-model.number="resolution"
            style="position: absolute; top: 20px; right: 20px;"
        />
    </div>
</template>
