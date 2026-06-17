import { create } from 'zustand';
import type { PartInfo, VerifyRecord, VerifyStatus } from '@/types';
import { getPartInfoBySerial, getVerifyRecords } from '@/data/mock';

interface VerifyState {
  currentPart: PartInfo | null;
  verifyRecords: VerifyRecord[];
  isLoading: boolean;
  error: string | null;
  searchSerial: string;
  aircraftNo: string;
  position: string;
  positionConfirmed: boolean;
  setSearchSerial: (serial: string) => void;
  setAircraftNo: (no: string) => void;
  setPosition: (pos: string) => void;
  setPositionConfirmed: (confirmed: boolean) => void;
  verifyPart: (serial: string) => Promise<PartInfo | null>;
  confirmVerify: () => Promise<boolean>;
  loadRecords: () => void;
  resetState: () => void;
}

export const useVerifyStore = create<VerifyState>((set, get) => ({
  currentPart: null,
  verifyRecords: [],
  isLoading: false,
  error: null,
  searchSerial: '',
  aircraftNo: '',
  position: '',
  positionConfirmed: false,

  setSearchSerial: (serial) => set({ searchSerial: serial }),
  setAircraftNo: (no) => set({ aircraftNo: no }),
  setPosition: (pos) => set({ position: pos }),
  setPositionConfirmed: (confirmed) => set({ positionConfirmed: confirmed }),

  verifyPart: async (serial) => {
    console.log('[VerifyStore] 开始核验航材，序号:', serial);
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const part = getPartInfoBySerial(serial);
      
      if (part) {
        console.log('[VerifyStore] 核验成功，航材信息:', part.partName, '状态:', part.statusText);
        set({ 
          currentPart: part,
          aircraftNo: part.lastInstallAircraft,
          position: part.lastInstallPosition
        });
        return part;
      } else {
        console.log('[VerifyStore] 未找到航材信息，序号:', serial);
        set({ 
          currentPart: null,
          error: '系统中未找到该航材信息'
        });
        return null;
      }
    } catch (err) {
      console.error('[VerifyStore] 核验失败:', err);
      set({ error: '核验失败，请稍后重试', currentPart: null });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  confirmVerify: async () => {
    const { currentPart, aircraftNo, position, positionConfirmed, verifyRecords } = get();
    
    if (!currentPart) {
      console.error('[VerifyStore] 确认核验失败：未获取到航材信息');
      return false;
    }
    
    if (!positionConfirmed) {
      console.error('[VerifyStore] 确认核验失败：位置未确认');
      return false;
    }

    console.log('[VerifyStore] 确认核验，飞机号:', aircraftNo, '位置:', position);

    const newRecord: VerifyRecord = {
      id: String(Date.now()),
      serialNumber: currentPart.serialNumber,
      partName: currentPart.partName,
      aircraftNo: currentPart.lastInstallAircraft,
      position: currentPart.lastInstallPosition,
      positionConfirmed: true,
      status: currentPart.status,
      statusText: currentPart.statusText,
      verifyTime: new Date().toLocaleString('zh-CN'),
      verifyUser: '维修员',
      aircraftNoInput: aircraftNo,
      positionInput: position
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set({
        verifyRecords: [newRecord, ...verifyRecords]
      });
      
      console.log('[VerifyStore] 核验记录已保存');
      return true;
    } catch (err) {
      console.error('[VerifyStore] 保存核验记录失败:', err);
      return false;
    }
  },

  loadRecords: () => {
    console.log('[VerifyStore] 加载核验记录');
    const records = getVerifyRecords();
    set({ verifyRecords: records });
  },

  resetState: () => {
    console.log('[VerifyStore] 重置核验状态');
    set({
      currentPart: null,
      searchSerial: '',
      aircraftNo: '',
      position: '',
      positionConfirmed: false,
      error: null
    });
  }
}));
