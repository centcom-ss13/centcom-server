import auditLogService from '../service/auditLogs';

const getAuditLogs = {
  method: 'GET',
  path: '/auditLogs',
  handler: async function (request, h) {
    return await auditLogService.getAuditLogs();
  },
};

export default [
  getAuditLogs,
];