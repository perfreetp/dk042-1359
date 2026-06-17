import { create } from 'zustand';
import type { ReportItem } from '@/types';
import { getReportList } from '@/data/mock';

type ReportType = 'blurry' | 'mismatch' | 'noRecord';

interface ReportState {
  reportList: ReportItem[];
  isLoading: boolean;
  error: string | null;
  reportType: ReportType;
  serialNumber: string;
  partName: string;
  flightNo: string;
  parkingPosition: string;
  photos: string[];
  remark: string;
  setReportType: (type: ReportType) => void;
  setSerialNumber: (sn: string) => void;
  setPartName: (name: string) => void;
  setFlightNo: (no: string) => void;
  setParkingPosition: (pos: string) => void;
  setPhotos: (photos: string[]) => void;
  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;
  setRemark: (remark: string) => void;
  submitReport: () => Promise<boolean>;
  loadReportList: () => void;
  resetState: () => void;
}

const reportTypeMap: Record<ReportType, string> = {
  blurry: '铭牌模糊',
  mismatch: '序号不符',
  noRecord: '系统无记录'
};

export const useReportStore = create<ReportState>((set, get) => ({
  reportList: [],
  isLoading: false,
  error: null,
  reportType: 'blurry',
  serialNumber: '',
  partName: '',
  flightNo: '',
  parkingPosition: '',
  photos: [],
  remark: '',

  setReportType: (type) => set({ reportType: type }),
  setSerialNumber: (sn) => set({ serialNumber: sn }),
  setPartName: (name) => set({ partName: name }),
  setFlightNo: (no) => set({ flightNo: no }),
  setParkingPosition: (pos) => set({ parkingPosition: pos }),
  setPhotos: (photos) => set({ photos }),
  addPhoto: (photo) => set(state => ({ photos: [...state.photos, photo] })),
  removePhoto: (index) => set(state => ({
    photos: state.photos.filter((_, i) => i !== index)
  })),
  setRemark: (remark) => set({ remark }),

  submitReport: async () => {
    const { reportType, serialNumber, partName, flightNo, parkingPosition, photos, remark, reportList } = get();

    console.log('[ReportStore] 提交异常报告，类型:', reportType, '序号:', serialNumber);

    if (!serialNumber) {
      console.error('[ReportStore] 提交失败：序号为空');
      return false;
    }
    if (!flightNo) {
      console.error('[ReportStore] 提交失败：航班号为空');
      return false;
    }
    if (!parkingPosition) {
      console.error('[ReportStore] 提交失败：停场位置为空');
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const newReport: ReportItem = {
        id: String(Date.now()),
        type: reportType,
        typeText: reportTypeMap[reportType],
        serialNumber,
        partName: partName || '未知航材',
        flightNo,
        parkingPosition,
        photos,
        remark,
        reportTime: new Date().toLocaleString('zh-CN'),
        reportUser: '维修员',
        status: 'pending',
        statusText: '待处理'
      };

      set({
        reportList: [newReport, ...reportList],
        isLoading: false
      });

      console.log('[ReportStore] 异常报告提交成功');
      return true;
    } catch (err) {
      console.error('[ReportStore] 提交失败:', err);
      set({ error: '提交失败，请稍后重试', isLoading: false });
      return false;
    }
  },

  loadReportList: () => {
    console.log('[ReportStore] 加载上报记录');
    const list = getReportList();
    set({ reportList: list });
  },

  resetState: () => {
    console.log('[ReportStore] 重置上报状态');
    set({
      reportType: 'blurry',
      serialNumber: '',
      partName: '',
      flightNo: '',
      parkingPosition: '',
      photos: [],
      remark: '',
      error: null
    });
  }
}));
