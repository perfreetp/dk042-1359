import { create } from 'zustand';
import type { ReportItem, ReportStatus } from '@/types';
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
  initialized: boolean;
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
  updateReportStatus: (id: string, status: ReportStatus) => void;
  initStore: () => void;
  resetState: () => void;
}

const reportTypeMap: Record<ReportType, string> = {
  blurry: '铭牌模糊',
  mismatch: '序号不符',
  noRecord: '系统无记录'
};

const reportStatusMap: Record<ReportStatus, string> = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已解决'
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
  initialized: false,

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

  initStore: () => {
    const state = get();
    if (state.initialized) return;
    const list = getReportList();
    set({
      reportList: list,
      initialized: true
    });
  },

  submitReport: async () => {
    const { reportType, serialNumber, partName, flightNo, parkingPosition, photos, remark, reportList } = get();

    if (!serialNumber) return false;
    if (!flightNo) return false;
    if (!parkingPosition) return false;

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

      return true;
    } catch (err) {
      set({ error: '提交失败，请稍后重试', isLoading: false });
      return false;
    }
  },

  updateReportStatus: (id, status) => {
    const { reportList } = get();
    const now = new Date().toLocaleString('zh-CN');
    set({
      reportList: reportList.map(r => {
        if (r.id !== id) return r;
        const updated = { ...r, status, statusText: reportStatusMap[status] };
        if (status === 'processing') {
          updated.processTime = now;
          updated.processRemark = 'MCC已受理，正在核实处理';
        }
        if (status === 'resolved') {
          updated.resolveTime = now;
          updated.resolveRemark = '问题已解决，可重新核验';
        }
        return updated;
      })
    });
  },

  resetState: () => {
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
