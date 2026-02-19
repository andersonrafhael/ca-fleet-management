// Mock BiometryAdapter — simulates biometric processing for dev/client validation
import type { BiometryAdapter, BiometryResult, EnrollmentResult } from './adapter'

function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export class MockBiometryAdapter implements BiometryAdapter {
    private successRate: number

    constructor(successRate = 0.85) {
        this.successRate = successRate
    }

    async isAvailable(): Promise<boolean> {
        // Check if MediaDevices API is accessible (real camera not required in mock)
        return typeof navigator !== 'undefined' && !!navigator.mediaDevices
    }

    async enroll(studentId: string, _videoElement: HTMLVideoElement): Promise<EnrollmentResult> {
        await delay(1800) // simulate capture + upload
        return {
            success: true,
            templateId: `tmpl_${studentId}_${Date.now()}`,
            capturedAt: new Date().toISOString(),
        }
    }

    async verify(studentId: string, _videoElement: HTMLVideoElement): Promise<BiometryResult> {
        await delay(2000) // simulate face matching

        if (Math.random() < this.successRate) {
            return {
                success: true,
                confidence: 0.75 + Math.random() * 0.24, // 0.75 – 0.99
                studentId,
                attemptId: crypto.randomUUID(),
            }
        }

        const errors = ['LOW_CONFIDENCE', 'NO_FACE', 'TIMEOUT'] as const
        return {
            success: false,
            confidence: 0.2 + Math.random() * 0.4,
            error: errors[Math.floor(Math.random() * errors.length)],
            attemptId: crypto.randomUUID(),
        }
    }

    dispose(): void {
        // No-op for mock
    }
}

// Singleton for dev
export const mockBiometry = new MockBiometryAdapter()
