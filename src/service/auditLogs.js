import AuditLogRepository from "../repository/auditLogs";

async function getAuditLogs() {
  return await AuditLogRepository.getAuditLogs();
}

async function createAuditLog(user_id, action, failed = false, endpoint, value = '{}') {
  return await AuditLogRepository.createAuditLog({
    action,
    user_id,
    failed,
    endpoint,
    value,
    timestamp: Date.now(),
  });
}

export default {
  getAuditLogs,
  createAuditLog,
};
