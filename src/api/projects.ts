import { demoUploadedMedia } from '../data/demoProjects';
import type { ProjectMediaItem, UploadProgress } from '../types/project';

const UPLOAD_DURATION_MS = 3000;
const TICK_MS = 100;

/**
 * Mock video upload. No bytes are sent anywhere — progress is simulated for the demo.
 *
 * @param fileName Display name for progress UI
 * @param onProgress Called as percent advances 0→100
 * @returns Media items to attach to the active project when complete
 */
export async function uploadProjectVideo(
  fileName: string,
  onProgress: (progress: UploadProgress) => void,
): Promise<ProjectMediaItem[]> {
  const started = Date.now();

  return new Promise((resolve) => {
    const tick = () => {
      const elapsed = Date.now() - started;
      const percent = Math.min(100, Math.round((elapsed / UPLOAD_DURATION_MS) * 100));
      onProgress({ percent, fileName });

      if (percent >= 100) {
        resolve(demoUploadedMedia);
        return;
      }

      window.setTimeout(tick, TICK_MS);
    };

    tick();
  });
}
