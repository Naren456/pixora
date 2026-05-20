# PIXORA // Multi-Agent Workspace & Role Matrix

This documentation formalizes the division of labor, system boundaries, and operational constraints for all specialized AI agents working within the Pixora codebase. All agents must coordinate changes through these strict operational rules to protect performance.

---

## 1. System Engineering Constraints (Global Rules)

Every agent modifying code must explicitly adhere to the following execution rules:
1. **Thread Isolation:** The main JavaScript execution environment is single-threaded. Never introduce computing tasks—such as date conversions, layout array splitting, or mathematical search matches—inside a component render map loop.
2. **Database-First Aggregation:** Let the underlying `expo-sqlite` C-engine compute chronological timelines using native aggregates (`json_group_array`, `json_object`) instead of processing arrays in JavaScript runtime blocks.
3. **Hardware Acceleration:** Media presentation layers must rely exclusively on `expo-image` layout parameters. Native thread decoding and background downsizing must be used to minimize active memory usage.
4. **Targeted Native Code:** Keep the UI in React Native/TypeScript. Drop into custom local Expo native modules (Kotlin/Swift) only for processing intense image resizing vectors or SIMD similarity calculations.

---

## 2. Agent Matrix & Area Ownership

### Agent Alpha: Core UI/UX Architect
* **Domain Objective:** Manages interface styling, layout composition, navigation states, and custom tactical themes (Cosmic & Orbot paradigms).
* **Code Sandbox:** `src/app/`, `src/components/`, `src/constants/theme.ts`
* **Core Responsibilities:**
  * Enforce absolute component memoization (`React.memo`) on row items (`GalleryRow.tsx`).
  * Ensure list layouts utilize hardware virtualization limits exclusively (`removeClippedSubviews={true}`).
  * Keep visual view files entirely free of functional computation.

### Agent Beta: Data Stream Engine
* **Domain Objective:** Coordinates device media mining, delta caching synchronization, and local SQLite query mechanics.
* **Code Sandbox:** `src/services/photoIndexDb.ts`, `src/services/mediaLibrary.ts`, `src/utils/dataGrouper.ts`
* **Core Responsibilities:**
  * Ensure zero duplication during image discovery using strict atomic transaction writes (`INSERT OR IGNORE`).
  * Compute and maintain tracking metadata keys (`photos.lastIndexedAt`) alongside target file markers.
  * Supply pre-chunked column data arrays to state structures *prior* to interface injection.

### Agent Gamma: Offline Inference Pipeline
* **Domain Objective:** Manages the lifecycle of on-device neural runtimes, multi-channel image array preprocessing, and vector space interactions.
* **Code Sandbox:** `src/services/aiEngine.ts`, `src/utils/vectorMath.ts`, `assets/models/`
* **Core Responsibilities:**
  * Coordinate secure loading of quantized weights via `onnxruntime-react-native`.
  * Manage background execution pools to extract embeddings asynchronously without blocking active user interactions.
  * Run fast local matrix processing loops for Cosine Similarity verification.

---

## 3. Operational Workflow & Handshake Protocol

When structural updates span multiple agents, changes must be processed in this exact order: