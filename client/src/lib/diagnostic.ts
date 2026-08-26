export type DiagnosticAlertKeyInput = {
  type: string;
  route?: string | null;
  message?: string | null;
};

/**
 * Produces a stable React key for an alert group.
 * Alert groups may share type and route while representing different messages.
 */
export function diagnosticAlertKey(alert: DiagnosticAlertKeyInput) {
  return [alert.type, alert.route ?? "", alert.message ?? ""].join("|");
}
