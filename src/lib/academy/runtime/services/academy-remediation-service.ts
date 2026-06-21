export class AcademyRemediationService {

  trigger(
    triggerType: string
  ) {

    return {
      remediationTriggered: true,
      triggerType,
      triggeredAt: new Date().toISOString(),
    }
  }
}
