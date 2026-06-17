import type { PartInfo, VerifyRecord, ReportItem, TodoVerify, UserInfo } from '@/types';

export const mockPartInfoList: PartInfo[] = [
  {
    id: '1',
    serialNumber: 'PN-2024-001234',
    partNumber: 'PN-001-A',
    partName: '主起落架减震支柱',
    isLifeControl: true,
    remainingHours: 1280,
    remainingCycles: 640,
    totalHours: 5000,
    totalCycles: 2500,
    melRestriction: null,
    cdlRestriction: null,
    lastInstallSigner: '张伟',
    lastInstallDate: '2024-05-15',
    lastInstallAircraft: 'B-6123',
    lastInstallPosition: '左主起落架',
    status: 'pass',
    statusText: '可放行'
  },
  {
    id: '2',
    serialNumber: 'PN-2024-001235',
    partNumber: 'PN-002-B',
    partName: '发动机高压涡轮叶片',
    isLifeControl: true,
    remainingHours: 120,
    remainingCycles: 60,
    totalHours: 3000,
    totalCycles: 1500,
    melRestriction: 'MEL 72-01-01A：剩余寿命低于200小时需监控',
    cdlRestriction: null,
    lastInstallSigner: '李明',
    lastInstallDate: '2024-04-20',
    lastInstallAircraft: 'B-6124',
    lastInstallPosition: '左发高压涡轮',
    status: 'warning',
    statusText: '需复核'
  },
  {
    id: '3',
    serialNumber: 'PN-2024-001236',
    partNumber: 'PN-003-C',
    partName: '辅助动力装置APU',
    isLifeControl: true,
    remainingHours: 0,
    remainingCycles: 0,
    totalHours: 8000,
    totalCycles: 4000,
    melRestriction: null,
    cdlRestriction: 'CDL 49-01-01：APU寿命到期禁止起飞',
    lastInstallSigner: '王强',
    lastInstallDate: '2023-12-10',
    lastInstallAircraft: 'B-6125',
    lastInstallPosition: '尾部APU舱',
    status: 'danger',
    statusText: '禁止放行'
  },
  {
    id: '4',
    serialNumber: 'PN-2024-001237',
    partNumber: 'PN-004-D',
    partName: '飞行数据记录仪FDR',
    isLifeControl: true,
    remainingHours: 3560,
    remainingCycles: 1780,
    totalHours: 10000,
    totalCycles: 5000,
    melRestriction: null,
    cdlRestriction: null,
    lastInstallSigner: '赵刚',
    lastInstallDate: '2024-03-05',
    lastInstallAircraft: 'B-6126',
    lastInstallPosition: '电子设备舱E1架',
    status: 'pass',
    statusText: '可放行'
  },
  {
    id: '5',
    serialNumber: 'PN-2024-001238',
    partNumber: 'PN-005-E',
    partName: '气象雷达天线',
    isLifeControl: true,
    remainingHours: 890,
    remainingCycles: 445,
    totalHours: 6000,
    totalCycles: 3000,
    melRestriction: null,
    cdlRestriction: null,
    lastInstallSigner: '刘洋',
    lastInstallDate: '2024-02-18',
    lastInstallAircraft: 'B-6127',
    lastInstallPosition: '机头雷达罩',
    status: 'pass',
    statusText: '可放行'
  },
  {
    id: '6',
    serialNumber: 'PN-2024-001239',
    partNumber: 'PN-006-F',
    partName: '空调系统ACM',
    isLifeControl: true,
    remainingHours: 180,
    remainingCycles: 90,
    totalHours: 4000,
    totalCycles: 2000,
    melRestriction: 'MEL 21-01-02：ACM剩余寿命低于300小时需每日检查',
    cdlRestriction: null,
    lastInstallSigner: '陈杰',
    lastInstallDate: '2024-01-25',
    lastInstallAircraft: 'B-6128',
    lastInstallPosition: '前货舱空调舱',
    status: 'warning',
    statusText: '需复核'
  },
  {
    id: '7',
    serialNumber: 'PN-2024-001240',
    partNumber: 'PN-007-G',
    partName: '高度表指示器',
    isLifeControl: false,
    remainingHours: 99999,
    remainingCycles: 99999,
    totalHours: 0,
    totalCycles: 0,
    melRestriction: null,
    cdlRestriction: null,
    lastInstallSigner: '周涛',
    lastInstallDate: '2024-06-01',
    lastInstallAircraft: 'B-6129',
    lastInstallPosition: '正驾驶仪表板P1',
    status: 'info',
    statusText: '非寿命件'
  },
  {
    id: '8',
    serialNumber: 'PN-2024-001241',
    partNumber: 'PN-008-H',
    partName: '自动油门作动器',
    isLifeControl: true,
    remainingHours: 2450,
    remainingCycles: 1225,
    totalHours: 6000,
    totalCycles: 3000,
    melRestriction: null,
    cdlRestriction: null,
    lastInstallSigner: '吴磊',
    lastInstallDate: '2024-05-20',
    lastInstallAircraft: 'B-6130',
    lastInstallPosition: '驾驶舱中央控制台P5',
    status: 'pass',
    statusText: '可放行'
  },
  {
    id: '9',
    serialNumber: 'PN-2024-001242',
    partNumber: 'PN-009-I',
    partName: '甚高频通讯电台VHF1',
    isLifeControl: false,
    remainingHours: 99999,
    remainingCycles: 99999,
    totalHours: 0,
    totalCycles: 0,
    melRestriction: null,
    cdlRestriction: null,
    lastInstallSigner: '郑凯',
    lastInstallDate: '2024-04-15',
    lastInstallAircraft: 'B-6131',
    lastInstallPosition: '电子设备舱E2架',
    status: 'info',
    statusText: '非寿命件'
  },
  {
    id: '10',
    serialNumber: 'PN-2024-001243',
    partNumber: 'PN-010-J',
    partName: '燃油流量传感器',
    isLifeControl: true,
    remainingHours: 50,
    remainingCycles: 25,
    totalHours: 2000,
    totalCycles: 1000,
    melRestriction: 'MEL 28-01-03：剩余寿命低于100小时需在下次A检更换',
    cdlRestriction: null,
    lastInstallSigner: '孙伟',
    lastInstallDate: '2024-03-10',
    lastInstallAircraft: 'B-6132',
    lastInstallPosition: '左机翼内侧前缘',
    status: 'warning',
    statusText: '需复核'
  }
];

export const mockVerifyRecords: VerifyRecord[] = [
  {
    id: '1',
    serialNumber: 'PN-2024-001234',
    partName: '主起落架减震支柱',
    aircraftNo: 'B-6123',
    position: '左主起落架',
    positionConfirmed: true,
    status: 'pass',
    statusText: '可放行',
    verifyTime: '2024-06-17 08:30:25',
    verifyUser: '维修员',
    aircraftNoInput: 'B-6123',
    positionInput: '左主起落架'
  },
  {
    id: '2',
    serialNumber: 'PN-2024-001235',
    partName: '发动机高压涡轮叶片',
    aircraftNo: 'B-6124',
    position: '左发高压涡轮',
    positionConfirmed: true,
    status: 'warning',
    statusText: '需复核',
    verifyTime: '2024-06-17 09:15:42',
    verifyUser: '维修员',
    aircraftNoInput: 'B-6124',
    positionInput: '左发高压涡轮'
  },
  {
    id: '3',
    serialNumber: 'PN-2024-001236',
    partName: '辅助动力装置APU',
    aircraftNo: 'B-6125',
    position: '尾部APU舱',
    positionConfirmed: true,
    status: 'danger',
    statusText: '禁止放行',
    verifyTime: '2024-06-17 10:20:18',
    verifyUser: '维修员',
    aircraftNoInput: 'B-6125',
    positionInput: '尾部APU舱'
  },
  {
    id: '4',
    serialNumber: 'PN-2024-001237',
    partName: '飞行数据记录仪FDR',
    aircraftNo: 'B-6126',
    position: '电子设备舱E1架',
    positionConfirmed: true,
    status: 'pass',
    statusText: '可放行',
    verifyTime: '2024-06-16 14:45:33',
    verifyUser: '维修员',
    aircraftNoInput: 'B-6126',
    positionInput: '电子设备舱E1架'
  },
  {
    id: '5',
    serialNumber: 'PN-2024-001238',
    partName: '气象雷达天线',
    aircraftNo: 'B-6127',
    position: '机头雷达罩',
    positionConfirmed: true,
    status: 'pass',
    statusText: '可放行',
    verifyTime: '2024-06-16 16:20:55',
    verifyUser: '维修员',
    aircraftNoInput: 'B-6127',
    positionInput: '机头雷达罩'
  },
  {
    id: '6',
    serialNumber: 'PN-2024-001239',
    partName: '空调系统ACM',
    aircraftNo: 'B-6128',
    position: '前货舱空调舱',
    positionConfirmed: true,
    status: 'warning',
    statusText: '需复核',
    verifyTime: '2024-06-15 11:30:12',
    verifyUser: '维修员',
    aircraftNoInput: 'B-6128',
    positionInput: '前货舱空调舱'
  },
  {
    id: '7',
    serialNumber: 'PN-2024-001240',
    partName: '高度表指示器',
    aircraftNo: 'B-6129',
    position: '正驾驶仪表板P1',
    positionConfirmed: true,
    status: 'info',
    statusText: '非寿命件',
    verifyTime: '2024-06-15 09:10:45',
    verifyUser: '维修员',
    aircraftNoInput: 'B-6129',
    positionInput: '正驾驶仪表板P1'
  },
  {
    id: '8',
    serialNumber: 'PN-2024-001241',
    partName: '自动油门作动器',
    aircraftNo: 'B-6130',
    position: '驾驶舱中央控制台P5',
    positionConfirmed: true,
    status: 'pass',
    statusText: '可放行',
    verifyTime: '2024-06-14 15:25:30',
    verifyUser: '维修员',
    aircraftNoInput: 'B-6130',
    positionInput: '驾驶舱中央控制台P5'
  }
];

export const mockReportList: ReportItem[] = [
  {
    id: '1',
    type: 'blurry',
    typeText: '铭牌模糊',
    serialNumber: 'PN-2024-001244',
    partName: '液压泵组件',
    flightNo: 'CA1234',
    parkingPosition: 'T2-15号桥位',
    photos: [],
    remark: '铭牌磨损严重，序号无法完全辨认',
    reportTime: '2024-06-17 07:45:20',
    reportUser: '维修员',
    status: 'processing',
    statusText: '处理中',
    processTime: '2024-06-17 08:10:00',
    processRemark: '已通知航材控制岗，正在核实铭牌信息'
  },
  {
    id: '2',
    type: 'mismatch',
    typeText: '序号不符',
    serialNumber: 'PN-2024-001245',
    partName: '发动机燃油泵',
    flightNo: 'MU5678',
    parkingPosition: 'T1-08号桥位',
    photos: [],
    remark: '实物序号与系统记录不一致',
    reportTime: '2024-06-16 14:30:55',
    reportUser: '维修员',
    status: 'resolved',
    statusText: '已解决',
    processTime: '2024-06-16 15:00:00',
    processRemark: '已确认实物序号，系统记录已更正',
    resolveTime: '2024-06-16 16:30:00',
    resolveRemark: '系统记录已更新，核验通过可放行'
  },
  {
    id: '3',
    type: 'noRecord',
    typeText: '系统无记录',
    serialNumber: 'PN-2024-001246',
    partName: '氧气发生器',
    flightNo: 'CZ9012',
    parkingPosition: '远机位D03',
    photos: [],
    remark: '系统中查询不到该件号信息',
    reportTime: '2024-06-15 10:15:40',
    reportUser: '维修员',
    status: 'pending',
    statusText: '待处理'
  },
  {
    id: '4',
    type: 'blurry',
    typeText: '铭牌模糊',
    serialNumber: 'PN-2024-001247',
    partName: '起落架收放作动筒',
    flightNo: 'HU3456',
    parkingPosition: 'T2-22号桥位',
    photos: [],
    remark: '铭牌被油污覆盖，部分数字看不清',
    reportTime: '2024-06-14 16:40:15',
    reportUser: '维修员',
    status: 'resolved',
    statusText: '已解决',
    processTime: '2024-06-14 17:00:00',
    processRemark: '已安排清洁铭牌并重新核验',
    resolveTime: '2024-06-14 18:20:00',
    resolveRemark: '清洁后序号可辨认，核验通过'
  },
  {
    id: '5',
    type: 'mismatch',
    typeText: '序号不符',
    serialNumber: 'PN-2024-001248',
    partName: '大气数据计算机',
    flightNo: '3U7890',
    parkingPosition: 'T1-12号桥位',
    photos: [],
    remark: '实体件序号与履历本记录不符',
    reportTime: '2024-06-13 09:25:30',
    reportUser: '维修员',
    status: 'processing',
    statusText: '处理中',
    processTime: '2024-06-13 10:00:00',
    processRemark: '已联系工程部门核实，等待回复'
  }
];

export const mockTodoList: TodoVerify[] = [
  {
    id: '1',
    aircraftNo: 'B-6123',
    position: '左主起落架',
    partName: '主起落架减震支柱',
    serialNumber: 'PN-2024-001234',
    deadline: '2024-06-17 10:00',
    priority: 'high',
    completed: false
  },
  {
    id: '2',
    aircraftNo: 'B-6124',
    position: '左发高压涡轮',
    partName: '发动机高压涡轮叶片',
    serialNumber: 'PN-2024-001235',
    deadline: '2024-06-17 11:30',
    priority: 'high',
    completed: false
  },
  {
    id: '3',
    aircraftNo: 'B-6125',
    position: '尾部APU舱',
    partName: '辅助动力装置APU',
    serialNumber: 'PN-2024-001236',
    deadline: '2024-06-17 12:00',
    priority: 'high',
    completed: false
  },
  {
    id: '4',
    aircraftNo: 'B-6128',
    position: '前货舱空调舱',
    partName: '空调系统ACM',
    serialNumber: 'PN-2024-001239',
    deadline: '2024-06-18 08:00',
    priority: 'medium',
    completed: false
  },
  {
    id: '5',
    aircraftNo: 'B-6132',
    position: '左机翼内侧前缘',
    partName: '燃油流量传感器',
    serialNumber: 'PN-2024-001243',
    deadline: '2024-06-18 14:00',
    priority: 'medium',
    completed: false
  }
];

export const mockUserInfo: UserInfo = {
  id: 'U001',
  name: '维修员',
  employeeId: 'EMP2024001',
  department: '航线维修部一车间',
  role: '放行人员',
  avatar: 'https://picsum.photos/id/64/200/200'
};

export const getPartInfoBySerial = (serial: string): PartInfo | null => {
  return mockPartInfoList.find(p => p.serialNumber === serial) || null;
};

export const getVerifyRecords = (): VerifyRecord[] => {
  return mockVerifyRecords;
};

export const getReportList = (): ReportItem[] => {
  return mockReportList;
};

export const getTodoList = (): TodoVerify[] => {
  return mockTodoList;
};

export const getUserInfo = (): UserInfo => {
  return mockUserInfo;
};
