import type { VerifyStatus } from '@/types';

export const getStatusColor = (status: VerifyStatus): string => {
  const colorMap: Record<VerifyStatus, string> = {
    pass: '#00B42A',
    warning: '#FF7D00',
    danger: '#F53F3F',
    info: '#165DFF'
  };
  return colorMap[status];
};

export const getStatusBgColor = (status: VerifyStatus): string => {
  const colorMap: Record<VerifyStatus, string> = {
    pass: 'rgba(0, 180, 42, 0.1)',
    warning: 'rgba(255, 125, 0, 0.1)',
    danger: 'rgba(245, 63, 63, 0.1)',
    info: 'rgba(22, 93, 255, 0.1)'
  };
  return colorMap[status];
};

export const getStatusText = (status: VerifyStatus): string => {
  const textMap: Record<VerifyStatus, string> = {
    pass: '可放行',
    warning: '需复核',
    danger: '禁止放行',
    info: '非寿命件'
  };
  return textMap[status];
};

export const formatNumber = (num: number): string => {
  if (num >= 99999) {
    return '-';
  }
  return num.toLocaleString('zh-CN');
};

export const formatRemaining = (hours: number, cycles: number): { hours: string; cycles: string; isWarning: boolean; isDanger: boolean } => {
  const isWarning = hours > 0 && hours <= 200;
  const isDanger = hours <= 0;
  
  return {
    hours: formatNumber(hours),
    cycles: formatNumber(cycles),
    isWarning,
    isDanger
  };
};

export const validateSerialNumber = (sn: string): boolean => {
  if (!sn || sn.trim().length === 0) {
    return false;
  }
  const pattern = /^[A-Z0-9\-]{6,30}$/i;
  return pattern.test(sn.trim());
};

export const validateAircraftNo = (no: string): boolean => {
  if (!no || no.trim().length === 0) {
    return false;
  }
  const pattern = /^B-\d{4}$/;
  return pattern.test(no.trim().toUpperCase());
};

export const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  const colorMap = {
    high: '#F53F3F',
    medium: '#FF7D00',
    low: '#00B42A'
  };
  return colorMap[priority];
};

export const getPriorityText = (priority: 'high' | 'medium' | 'low'): string => {
  const textMap = {
    high: '紧急',
    medium: '一般',
    low: '低'
  };
  return textMap[priority];
};
