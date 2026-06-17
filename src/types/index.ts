export type VerifyStatus = 'pass' | 'warning' | 'danger' | 'info';

export interface PartInfo {
  id: string;
  serialNumber: string;
  partNumber: string;
  partName: string;
  isLifeControl: boolean;
  remainingHours: number;
  remainingCycles: number;
  totalHours: number;
  totalCycles: number;
  melRestriction: string | null;
  cdlRestriction: string | null;
  lastInstallSigner: string;
  lastInstallDate: string;
  lastInstallAircraft: string;
  lastInstallPosition: string;
  status: VerifyStatus;
  statusText: string;
}

export interface VerifyRecord {
  id: string;
  serialNumber: string;
  partName: string;
  aircraftNo: string;
  position: string;
  positionConfirmed: boolean;
  status: VerifyStatus;
  statusText: string;
  verifyTime: string;
  verifyUser: string;
  aircraftNoInput: string;
  positionInput: string;
}

export interface ReportItem {
  id: string;
  type: 'blurry' | 'mismatch' | 'noRecord';
  typeText: string;
  serialNumber: string;
  partName: string;
  flightNo: string;
  parkingPosition: string;
  photos: string[];
  remark: string;
  reportTime: string;
  reportUser: string;
  status: 'pending' | 'processing' | 'resolved';
  statusText: string;
}

export interface TodoVerify {
  id: string;
  aircraftNo: string;
  position: string;
  partName: string;
  serialNumber: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UserInfo {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  role: string;
  avatar?: string;
}
