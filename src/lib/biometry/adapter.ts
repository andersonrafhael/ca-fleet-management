// BiometryAdapter — interface contract for swappable biometric providers
// New providers (device readers, cloud APIs) implement this interface without UI changes.

export type BiometryError =
    | 'LOW_CONFIDENCE'
    | 'NO_FACE'
    | 'CAMERA_ERROR'
    | 'TIMEOUT'
    | 'NETWORK'
    | 'NOT_ENROLLED'

export interface BiometryResult {
    success: boolean
    confidence?: number // 0-1
    studentId?: string
    error?: BiometryError
    attemptId: string // for audit log correlation
}

export interface EnrollmentResult {
    success: boolean
    templateId?: string
    error?: string
    capturedAt: string // ISO 8601
}

export interface BiometryAdapter {
    /** Check if the provider/device is available */
    isAvailable(): Promise<boolean>
    /** Enroll: capture and send embedding to backend */
    enroll(studentId: string, videoElement: HTMLVideoElement): Promise<EnrollmentResult>
    /** Verify: match face against enrolled template */
    verify(studentId: string, videoElement: HTMLVideoElement): Promise<BiometryResult>
    /** Release camera stream and workers */
    dispose(): void
}
