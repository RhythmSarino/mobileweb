<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-toolbar">
        <ion-title class="toolbar-title">✨ Gemini Vision AI</ion-title>
        <div slot="end" class="header-subtitle">โดย ญานวิทย์ 663380379-2</div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="custom-content">
      <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <span class="error-icon">⚠️</span>
        {{ error }}
      </div>

      <!-- Main Action Buttons Card -->
      <div class="cards-container">
        <div class="action-card">
          <div class="card-title">📸 Image Selection</div>
          <div class="button-group">
            <ion-button expand="block" class="btn-custom btn-file" @click="fileEl?.click()">
              <span class="btn-icon">📁</span>
              <span>Choose File</span>
            </ion-button>
            <ion-button expand="block" class="btn-custom btn-camera" @click="onTakePhoto">
              <span class="btn-icon">📷</span>
              <span>Take Photo</span>
            </ion-button>
          </div>
        </div>

        <!-- Image Preview Card -->
        <div class="preview-card">
          <div class="card-title">🖼️ Preview</div>
          <div class="image-container">
            <ion-img v-if="previewUrl" :src="previewUrl" class="preview-image" />
            <div v-else class="image-placeholder">
              <div class="placeholder-icon">🖼️</div>
              <p>No image selected yet</p>
            </div>
          </div>
        </div>

        <!-- Analyze Card -->
        <div class="analyze-card" v-if="img">
          <div class="card-title">🔍 Analysis</div>
          <ion-button expand="block" class="btn-custom btn-analyze" :disabled="loading" @click="onAnalyze">
            <span v-if="loading" class="btn-icon">⚙️</span>
            <span v-else class="btn-icon">🚀</span>
            <span>{{ loading ? 'Analyzing...' : 'Analyze Image' }}</span>
          </ion-button>
          <div v-if="loading" class="loading-indicator">
            <ion-spinner color="primary"></ion-spinner>
            <p>Processing your image...</p>
          </div>
        </div>

        <!-- Results Card -->
        <div v-if="result" class="results-card">
          <div class="card-title">📊 Results</div>
          
          <div class="result-section">
            <div class="result-label">📝 Caption</div>
            <div class="result-content">{{ result.caption }}</div>
          </div>

          <div class="result-section">
            <div class="result-label">🏷️ Tags</div>
            <div class="tags-container">
              <span v-for="(tag, idx) in (Array.isArray(result.tags) ? result.tags : [result.tags])" :key="idx" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <div v-if="result.objects" class="result-section">
            <div class="result-label">🔎 Objects Detected</div>
            <div class="tags-container">
              <span v-for="(obj, idx) in (Array.isArray(result.objects) ? result.objects : [result.objects])" :key="idx" class="tag tag-object">
                {{ obj }}
              </span>
            </div>
          </div>

          <div v-if="result.safety" class="result-section">
            <div class="result-label">⚡ Safety Status</div>
            <div class="safety-badge" :class="{ 'safety-safe': !result.safety.isSensitive, 'safety-warning': result.safety.isSensitive }">
              {{ result.safety.isSensitive ? 'Warning' : 'Safe' }}
              <template v-if="result.safety.notes"> — {{ result.safety.notes }}</template>
            </div>
          </div>

          <details class="json-details">
            <summary>📋 Raw JSON Data</summary>
            <pre class="json-result">{{ JSON.stringify(result, null, 2) }}</pre>
          </details>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonButton, IonContent, IonHeader, IonImg, IonPage, IonSpinner, IonTitle, IonToolbar
} from "@ionic/vue";
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image } from "../core/ai.interface"; ;
import type { ImageAnalysisResult } from "../core/ai.interface";


const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);
const error = ref("");

onMounted(() => {
  console.log("Tab1Page mounted");
});

async function onFileChange(e: Event) {
  try {
    error.value = "";
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    img.value = await PhotoService.fromFile(file);
    previewUrl.value = URL.createObjectURL(file);
    result.value = null;
  } catch (err: any) {
    error.value = `Error loading file: ${err.message}`;
  }
}


async function onTakePhoto() {
  try {
    error.value = "";
    loading.value = true;
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } catch (err: any) {
    error.value = `Error taking photo: ${err.message}`;
  } finally {
    loading.value = false;
  }
}


async function onAnalyze() {
  if (!img.value) return;
  try {
    error.value = "";
    loading.value = true;
    result.value = await GeminiVisionService.analyze(img.value);
  } catch (err: any) {
    error.value = `Error analyzing image: ${err.message}`;
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  --shadow-hover: 0 12px 40px rgba(102, 126, 234, 0.25);
}

.custom-toolbar {
  --background: var(--primary-gradient);
  box-shadow: var(--shadow);
}

.toolbar-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
  padding-right: 16px;
}

.custom-content {
  --background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 0;
}

.cards-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

/* Error Message */
.error-message {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  box-shadow: var(--shadow);
  animation: slideDown 0.3s ease-out;
}

.error-icon {
  font-size: 1.5rem;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Card Styles */
.action-card,
.preview-card,
.analyze-card,
.results-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.action-card:hover,
.preview-card:hover,
.analyze-card:hover,
.results-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Button Group */
.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-custom {
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  color: white;
  border: none;
}

.btn-file {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-camera {
  --background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-analyze {
  --background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  width: 100%;
  font-size: 1.05rem;
  padding: 16px !important;
}

.btn-custom:hover:not(:disabled) {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.btn-custom:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.3rem;
}

/* Image Container */
.image-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #94a3b8;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.6;
}

.image-placeholder p {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Loading Indicator */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
  color: #667eea;
}

.loading-indicator p {
  margin: 0;
  font-weight: 500;
  font-size: 0.95rem;
}

/* Results Styling */
.result-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.result-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.result-label {
  font-weight: 600;
  color: #667eea;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.result-content {
  color: #334155;
  line-height: 1.6;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

/* Tags */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tag:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tag-object {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Safety Badge */
.safety-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.safety-safe {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.safety-warning {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
}

/* JSON Details */
.json-details {
  margin-top: 20px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
}

.json-details summary {
  font-weight: 600;
  color: #667eea;
  padding: 8px;
  outline: none;
  transition: color 0.2s ease;
}

.json-details summary:hover {
  color: #764ba2;
}

.json-result {
  background: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  margin: 12px 0 0 0;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 480px) {
  .cards-container {
    padding: 12px;
  }

  .button-group {
    grid-template-columns: 1fr;
  }

  .card-title {
    font-size: 1rem;
  }

  .toolbar-title {
    font-size: 1.2rem;
  }
}
</style>