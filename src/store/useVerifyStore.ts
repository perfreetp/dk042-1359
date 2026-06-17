import { create } from 'zustand';
import type { PartInfo, VerifyRecord, VerifyStatus, TodoVerify } from '@/types';
import { getPartInfoBySerial, getVerifyRecords, getTodoList } from '@/data/mock';

interface VerifyState {
  currentPart: PartInfo | null;
  verifyRecords: VerifyRecord[];
  todoList: TodoVerify[];
  isLoading: boolean;
  error: string | null;
  searchSerial: string;
  aircraftNo: string;
  position: string;
  positionConfirmed: boolean;
  activeTodoId: string | null;
  initialized: boolean;
  setSearchSerial: (serial: string) => void;
  setAircraftNo: (no: string) => void;
  setPosition: (pos: string) => void;
  setPositionConfirmed: (confirmed: boolean) => void;
  setActiveTodoId: (id: string | null) => void;
  verifyPart: (serial: string) => Promise<PartInfo | null>;
  confirmVerify: () => Promise<boolean>;
  completeTodo: (id: string) => void;
  initStore: () => void;
  resetState: () => void;
}

export const useVerifyStore = create<VerifyState>((set, get) => ({
  currentPart: null,
  verifyRecords: [],
  todoList: [],
  isLoading: false,
  error: null,
  searchSerial: '',
  aircraftNo: '',
  position: '',
  positionConfirmed: false,
  activeTodoId: null,
  initialized: false,

  setSearchSerial: (serial) => set({ searchSerial: serial }),
  setAircraftNo: (no) => set({ aircraftNo: no }),
  setPosition: (pos) => set({ position: pos }),
  setPositionConfirmed: (confirmed) => set({ positionConfirmed: confirmed }),
  setActiveTodoId: (id) => set({ activeTodoId: id }),

  initStore: () => {
    const state = get();
    if (state.initialized) return;
    const records = getVerifyRecords();
    const todos = getTodoList();
    set({
      verifyRecords: records,
      todoList: todos,
      initialized: true
    });
  },

  verifyPart: async (serial) => {
    set({ isLoading: true, error: null });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const part = getPartInfoBySerial(serial);

      if (part) {
        set({
          currentPart: part,
          aircraftNo: part.lastInstallAircraft,
          position: part.lastInstallPosition
        });
        return part;
      } else {
        set({
          currentPart: null,
          error: '系统中未找到该航材信息'
        });
        return null;
      }
    } catch (err) {
      set({ error: '核验失败，请稍后重试', currentPart: null });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  confirmVerify: async () => {
    const { currentPart, aircraftNo, position, positionConfirmed, verifyRecords, activeTodoId, todoList } = get();

    if (!currentPart) return false;
    if (!positionConfirmed) return false;

    const isAircraftMatch = aircraftNo.toUpperCase() === currentPart.lastInstallAircraft.toUpperCase();
    const isPositionMatch = position === currentPart.lastInstallPosition;

    let finalStatus: VerifyStatus = currentPart.status;
    let finalStatusText: string = currentPart.statusText;
    let mismatchReason: string | undefined;

    if (!isAircraftMatch || !isPositionMatch) {
      const reasons: string[] = [];
      if (!isAircraftMatch) {
        reasons.push(`飞机号不一致（系统:${currentPart.lastInstallAircraft} 现场:${aircraftNo}）`);
      }
      if (!isPositionMatch) {
        reasons.push(`安装位置不一致（系统:${currentPart.lastInstallPosition} 现场:${position}）`);
      }
      mismatchReason = reasons.join('；');

      if (finalStatus === 'pass') {
        finalStatus = 'warning';
        finalStatusText = '需复核（位置不一致）';
      }
    }

    const newRecord: VerifyRecord = {
      id: String(Date.now()),
      serialNumber: currentPart.serialNumber,
      partName: currentPart.partName,
      aircraftNo: currentPart.lastInstallAircraft,
      position: currentPart.lastInstallPosition,
      positionConfirmed: true,
      status: finalStatus,
      statusText: finalStatusText,
      verifyTime: new Date().toLocaleString('zh-CN'),
      verifyUser: '维修员',
      aircraftNoInput: aircraftNo,
      positionInput: position,
      mismatchReason,
      todoId: activeTodoId || undefined
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      let updatedTodos = todoList;
      if (activeTodoId) {
        updatedTodos = todoList.map(t =>
          t.id === activeTodoId
            ? { ...t, completed: true, completedAt: new Date().toLocaleString('zh-CN') }
            : t
        );
      }

      set({
        verifyRecords: [newRecord, ...verifyRecords],
        todoList: updatedTodos
      });

      return true;
    } catch (err) {
      return false;
    }
  },

  completeTodo: (id) => {
    const { todoList } = get();
    set({
      todoList: todoList.map(t =>
        t.id === id
          ? { ...t, completed: true, completedAt: new Date().toLocaleString('zh-CN') }
          : t
      )
    });
  },

  resetState: () => {
    set({
      currentPart: null,
      searchSerial: '',
      aircraftNo: '',
      position: '',
      positionConfirmed: false,
      error: null,
      activeTodoId: null
    });
  }
}));
