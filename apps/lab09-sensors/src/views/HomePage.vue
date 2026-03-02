<template>
  <ion-page>
    <ion-content :fullscreen="true" class="premium-bg">
      <div class="header-container">
        <h1 class="app-title">PowerLift</h1>
        <p class="app-subtitle">Sensor-based Arm Workout</p>
      </div>

      <div class="main-display">
        <div class="circle-container" :class="{ 'is-running': isRunning }">
          <div class="circle-inner">
            <span class="rep-count">{{ state?.repDisplay ?? 0 }}</span>
            <span class="rep-label">REPS</span>
          </div>
          <div class="glow-ring"></div>
        </div>
      </div>

      <div class="status-message" :class="messageClass">
        <ion-icon :icon="statusIcon" class="status-icon"></ion-icon>
        <span>{{ currentMessage }}</span>
      </div>

      <div class="stats-grid">
        <div class="stat-card glass">
          <div class="stat-value">{{ state?.stats.score ?? 0 }}</div>
          <div class="stat-label">Score</div>
        </div>
        <div class="stat-card glass">
          <div class="stat-value">{{ state?.stats.repsOk ?? 0 }}</div>
          <div class="stat-label">Perfect</div>
        </div>
        <div class="stat-card glass">
          <div class="stat-value">{{ state?.stats.repsBad ?? 0 }}</div>
          <div class="stat-label">Missed</div>
        </div>
        <div class="stat-card glass">
          <div class="stat-value">{{ avgSecs }}s</div>
          <div class="stat-label">Pace</div>
        </div>
      </div>

      <div class="action-container">
        <button 
          v-if="!isRunning" 
          class="btn-primary" 
          @click="start"
        >
          <ion-icon :icon="playOutline" class="btn-icon"></ion-icon>
          Start Workout
        </button>
        <button 
          v-else 
          class="btn-danger" 
          @click="stop"
        >
          <ion-icon :icon="stopOutline" class="btn-icon"></ion-icon>
          Stop Workout
        </button>
      </div>

      <div class="footer-text">
        663380379-2 นายญานวิทย์ พิชญกุลมงคล
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { IonPage, IonContent, IonIcon } from "@ionic/vue";
import { playOutline, stopOutline, checkmarkCircleOutline, alertCircleOutline, informationCircleOutline } from "ionicons/icons";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

const state = ref<WorkoutState | null>(null);
const engine = new ArmWorkoutEngine();

onMounted(() => {
  engine.onChange((s) => (state.value = s));
});

const isRunning = computed(() => state.value?.status === "RUNNING");

const currentMessage = computed(() => {
  if (!isRunning.value && state.value?.status !== "STOPPED") return "Ready to start";
  if (!isRunning.value && state.value?.status === "STOPPED") return "Workout finished";
  return state.value?.stats.lastMessage || "Keep going!";
});

const messageClass = computed(() => {
  const msg = state.value?.stats.lastMessage || "";
  if (!isRunning.value) return "neutral";
  if (msg === "OK" || msg === "") return "success";
  return "warning";
});

const statusIcon = computed(() => {
  if (!isRunning.value) return informationCircleOutline;
  const msg = state.value?.stats.lastMessage || "";
  if (msg === "OK" || msg === "") return checkmarkCircleOutline;
  return alertCircleOutline;
});

const avgSecs = computed(() => {
  const ms = state.value?.stats.avgRepMs || 0;
  return (ms / 1000).toFixed(1);
});

async function start() {
  await engine.startWorkout();
}

async function stop() {
  await engine.stopWorkout();
}
</script>

<style scoped>
/* Premium Dark Theme */
.premium-bg {
  --background: radial-gradient(circle at 50% 0%, #1e2029 0%, #0d0e12 100%);
  color: #ffffff;
}

.header-container {
  padding: 40px 20px 20px;
  text-align: center;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
}

.app-subtitle {
  font-size: 1rem;
  color: #8b92a5;
  margin-top: 5px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.main-display {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
}

.circle-container {
  position: relative;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #15171e, #1c1e27);
  box-shadow: 20px 20px 60px #0b0c0f, -20px -20px 60px #1f222b;
  transition: all 0.3s ease;
}

.circle-container.is-running .glow-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #4facfe, #00f2fe, #4facfe);
  z-index: -1;
  animation: spin 3s linear infinite;
  opacity: 0.8;
  filter: blur(8px);
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.circle-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: #111318;
  z-index: 10;
}

.rep-count {
  font-size: 5rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.rep-label {
  font-size: 1rem;
  color: #4facfe;
  font-weight: 600;
  letter-spacing: 3px;
  margin-top: 5px;
}

.status-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto 30px;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  width: max-content;
  max-width: 80%;
  backdrop-filter: blur(10px);
  animation: fadeUp 0.5s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.status-message.neutral {
  background: rgba(255, 255, 255, 0.05);
  color: #8b92a5;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-message.success {
  background: rgba(0, 242, 254, 0.1);
  color: #00f2fe;
  border: 1px solid rgba(0, 242, 254, 0.2);
}

.status-message.warning {
  background: rgba(255, 99, 132, 0.1);
  color: #ff6384;
  border: 1px solid rgba(255, 99, 132, 0.2);
}

.status-icon {
  font-size: 1.4rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 0 20px;
  margin-bottom: 40px;
}

.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s ease;
}

.glass:active {
  transform: scale(0.95);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.85rem;
  color: #8b92a5;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.action-container {
  padding: 0 20px;
  margin-bottom: 40px;
}

.btn-primary, .btn-danger {
  width: 100%;
  padding: 18px;
  border-radius: 16px;
  border: none;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  color: #0d0e12;
}

.btn-primary:active {
  transform: translateY(2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
  color: #ffffff;
}

.btn-danger:active {
  transform: translateY(2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 1.5rem;
}

.footer-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.8rem;
  padding-bottom: 30px;
}
</style>
