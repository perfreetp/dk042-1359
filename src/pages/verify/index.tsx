import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Input, Button, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useVerifyStore } from '@/store/useVerifyStore';
import { useReportStore } from '@/store/useReportStore';
import { mockPartInfoList } from '@/data/mock';
import { validateSerialNumber } from '@/utils';
import StatusCard from '@/components/StatusCard';
import VerifyResult from '@/components/VerifyResult';
import type { PartInfo } from '@/types';

const VerifyPage: React.FC = () => {
  const {
    currentPart,
    isLoading,
    error,
    searchSerial,
    aircraftNo,
    position,
    positionConfirmed,
    activeTodoId,
    setSearchSerial,
    setAircraftNo,
    setPosition,
    setPositionConfirmed,
    setActiveTodoId,
    verifyPart,
    confirmVerify,
    resetState,
    initStore
  } = useVerifyStore();

  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    initStore();
  }, [initStore]);

  useEffect(() => {
    if (searchSerial) {
      setInputValue(searchSerial);
    }
  }, [searchSerial]);

  useDidShow(() => {
    if (searchSerial && !currentPart) {
      handleVerify();
    }
  });

  const isAircraftMatch = currentPart
    ? aircraftNo.toUpperCase() === currentPart.lastInstallAircraft.toUpperCase()
    : true;
  const isPositionMatch = currentPart
    ? position === currentPart.lastInstallPosition
    : true;
  const hasMismatch = !isAircraftMatch || !isPositionMatch;

  const canConfirmPass = currentPart
    ? currentPart.status === 'pass' && !hasMismatch && positionConfirmed
    : false;
  const canConfirmOther = currentPart
    ? currentPart.status !== 'pass' && positionConfirmed
    : false;

  const handleScan = useCallback(() => {
    Taro.scanCode({
      onlyFromCamera: false,
      scanType: ['barCode', 'qrCode'],
      success: (res) => {
        const code = res.result.toUpperCase();
        setInputValue(code);
        setSearchSerial(code);
        handleVerifyWithSerial(code);
      },
      fail: () => {
        Taro.showToast({ title: '扫描取消', icon: 'none' });
      }
    });
  }, [setSearchSerial]);

  const handleVerifyWithSerial = useCallback(async (serial: string) => {
    if (!validateSerialNumber(serial)) {
      Taro.showToast({ title: '请输入有效的序号', icon: 'none' });
      return;
    }

    setShowResult(false);
    const result = await verifyPart(serial);

    if (result) {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  }, [verifyPart]);

  const handleVerify = useCallback(() => {
    const serial = inputValue.trim().toUpperCase();
    setSearchSerial(serial);
    handleVerifyWithSerial(serial);
  }, [inputValue, setSearchSerial, handleVerifyWithSerial]);

  const handleClearInput = useCallback(() => {
    setInputValue('');
    setSearchSerial('');
    resetState();
    setShowResult(false);
  }, [setSearchSerial, resetState]);

  const handleQuickInput = useCallback((sn: string) => {
    setInputValue(sn);
    setSearchSerial(sn);
    handleVerifyWithSerial(sn);
  }, [setSearchSerial, handleVerifyWithSerial]);

  const handleToggleConfirm = useCallback(() => {
    setPositionConfirmed(!positionConfirmed);
  }, [positionConfirmed, setPositionConfirmed]);

  const handleConfirmVerify = useCallback(async () => {
    if (!positionConfirmed) {
      Taro.showToast({ title: '请先确认位置信息', icon: 'none' });
      return;
    }

    if (hasMismatch && currentPart?.status === 'pass') {
      Taro.showModal({
        title: '位置不一致提示',
        content: '飞机号或安装位置与系统记录不一致，核验结果将标记为"需复核"。是否继续确认？',
        confirmText: '继续确认',
        cancelText: '取消',
        success: async (res) => {
          if (res.confirm) {
            await doConfirm();
          }
        }
      });
      return;
    }

    await doConfirm();
  }, [positionConfirmed, hasMismatch, currentPart]);

  const doConfirm = useCallback(async () => {
    const success = await confirmVerify();

    if (success) {
      Taro.showToast({
        title: '核验确认成功',
        icon: 'success'
      });

      setTimeout(() => {
        resetState();
        setShowResult(false);
        setInputValue('');
      }, 1500);
    } else {
      Taro.showToast({ title: '确认失败，请重试', icon: 'none' });
    }
  }, [confirmVerify, resetState]);

  const handlePositionEdit = useCallback(() => {
    Taro.showModal({
      title: '修改位置',
      editable: true,
      placeholderText: '请输入实际位置',
      content: position,
      success: (res) => {
        if (res.confirm && res.content) {
          setPosition(res.content.trim());
        }
      }
    });
  }, [position, setPosition]);

  const handleAircraftEdit = useCallback(() => {
    Taro.showModal({
      title: '修改飞机号',
      editable: true,
      placeholderText: '请输入实际飞机号',
      content: aircraftNo,
      success: (res) => {
        if (res.confirm && res.content) {
          setAircraftNo(res.content.trim().toUpperCase());
        }
      }
    });
  }, [aircraftNo, setAircraftNo]);

  const handleMismatchReport = useCallback(() => {
    const reportState = useReportStore.getState();
    reportState.setSerialNumber(searchSerial);
    reportState.setPartName(currentPart?.partName || '');
    reportState.setReportType('mismatch');
    const reasons: string[] = [];
    if (!isAircraftMatch) {
      reasons.push(`飞机号不一致（系统:${currentPart?.lastInstallAircraft} 现场:${aircraftNo}）`);
    }
    if (!isPositionMatch) {
      reasons.push(`安装位置不一致（系统:${currentPart?.lastInstallPosition} 现场:${position}）`);
    }
    reportState.setRemark(reasons.join('；'));
    Taro.switchTab({ url: '/pages/report/index' });
  }, [searchSerial, currentPart, aircraftNo, position, isAircraftMatch, isPositionMatch]);

  const handleReport = useCallback(() => {
    const reportState = useReportStore.getState();
    reportState.setSerialNumber(searchSerial);
    reportState.setPartName(currentPart?.partName || '');
    reportState.setReportType('noRecord');
    Taro.switchTab({ url: '/pages/report/index' });
  }, [searchSerial, currentPart]);

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.searchSection}>
        <Text className={styles.searchTitle}>航材序号</Text>

        <View className={styles.searchInput}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.input}
            placeholder="请扫描或输入航材序号"
            placeholderClass={styles.placeholder}
            value={inputValue}
            onInput={(e) => setInputValue(e.detail.value.toUpperCase())}
            onConfirm={handleVerify}
            confirmType="search"
            autoFocus
          />
          {inputValue && (
            <Text className={styles.clearBtn} onClick={handleClearInput}>✕</Text>
          )}
        </View>

        <Text style={{ fontSize: '24rpx', color: '#86909C', marginBottom: '16rpx' }}>
          快速测试（点击输入）：
        </Text>
        <View className={styles.quickInput}>
          {mockPartInfoList.slice(0, 5).map(part => (
            <Text
              key={part.id}
              className={styles.quickTag}
              onClick={() => handleQuickInput(part.serialNumber)}
            >
              {part.serialNumber.slice(-6)}
            </Text>
          ))}
        </View>

        <View className={styles.buttonGroup}>
          <Button
            className={classnames(styles.btn, styles.btnSecondary)}
            onClick={handleScan}
          >
            📷 扫描铭牌
          </Button>
          <Button
            className={classnames(styles.btn, styles.btnPrimary)}
            onClick={handleVerify}
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? '核验中...' : '立即核验'}
          </Button>
        </View>
      </View>

      <View className={styles.tipSection}>
        <Text className={styles.tipTitle}>💡 操作提示</Text>
        <Text className={styles.tipText}>
          请扫描航材铭牌上的二维码或条形码，也可手动输入序号。核验前请确认飞机号和安装位置与系统记录一致。
        </Text>
      </View>

      <View className={styles.resultSection}>
        {isLoading && (
          <View className={styles.loadingSection}>
            <Text className={styles.loadingIcon}>⏳</Text>
            <Text className={styles.loadingText}>正在核验航材信息...</Text>
          </View>
        )}

        {error && !isLoading && (
          <View className={styles.errorSection}>
            <Text className={styles.errorIcon}>⚠️</Text>
            <Text className={styles.errorText}>{error}</Text>
            <Button className={styles.errorAction} onClick={handleReport}>
              异常上报
            </Button>
          </View>
        )}

        {showResult && currentPart && !isLoading && (
          <View>
            <StatusCard
              status={currentPart.status}
              partName={currentPart.partName}
              serialNumber={currentPart.serialNumber}
              isLifeControl={currentPart.isLifeControl}
              remainingHours={currentPart.remainingHours}
              remainingCycles={currentPart.remainingCycles}
            />

            {hasMismatch && (
              <View className={styles.mismatchWarning}>
                <Text className={styles.mismatchTitle}>⚠️ 现场信息不一致</Text>
                {!isAircraftMatch && (
                  <View className={styles.mismatchRow}>
                    <Text className={styles.mismatchLabel}>飞机号不一致</Text>
                    <Text className={styles.mismatchDetail}>
                      系统: {currentPart.lastInstallAircraft} → 现场: {aircraftNo}
                    </Text>
                  </View>
                )}
                {!isPositionMatch && (
                  <View className={styles.mismatchRow}>
                    <Text className={styles.mismatchLabel}>位置不一致</Text>
                    <Text className={styles.mismatchDetail}>
                      系统: {currentPart.lastInstallPosition} → 现场: {position}
                    </Text>
                  </View>
                )}
                <View className={styles.mismatchActions}>
                  <Button
                    className={styles.mismatchReportBtn}
                    onClick={handleMismatchReport}
                  >
                    📷 异常上报
                  </Button>
                </View>
                {currentPart.status === 'pass' && (
                  <Text className={styles.mismatchNote}>
                    提示：位置不一致时，可放行件将自动标记为"需复核"
                  </Text>
                )}
              </View>
            )}

            <VerifyResult
              part={currentPart}
              aircraftNo={aircraftNo}
              position={position}
              positionConfirmed={positionConfirmed}
              onPositionChange={setPosition}
              onPositionConfirm={setPositionConfirmed}
            />
          </View>
        )}

        {!isLoading && !error && !showResult && (
          <View className={styles.emptySection}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyTitle}>开始核验</Text>
            <Text className={styles.emptyDesc}>
              扫描航材铭牌二维码或输入序号，{'\n'}
              快速获取寿命件状态信息
            </Text>
          </View>
        )}
      </View>

      {showResult && currentPart && (
        <View className={styles.confirmSection}>
          <View className={styles.checkboxRow} onClick={handleToggleConfirm}>
            <View className={classnames(styles.checkbox, positionConfirmed && styles.checked)}>
              {positionConfirmed && <Text className={styles.checkIcon}>✓</Text>}
            </View>
            <Text className={styles.checkboxLabel}>
              我已确认当前飞机号
              <Text
                className={classnames(styles.highlight, !isAircraftMatch && styles.highlightDanger)}
                onClick={(e) => { e.stopPropagation(); handleAircraftEdit(); }}
              >
                {aircraftNo}
              </Text>
              和安装位置
              <Text
                className={classnames(styles.highlight, !isPositionMatch && styles.highlightDanger)}
                onClick={(e) => { e.stopPropagation(); handlePositionEdit(); }}
              >
                {position}
              </Text>
              与实际情况一致
            </Text>
          </View>

          <Button
            className={classnames(
              styles.confirmBtn,
              positionConfirmed && styles.confirmBtnEnabled,
              hasMismatch && currentPart.status === 'pass' && styles.confirmBtnWarning
            )}
            onClick={handleConfirmVerify}
            disabled={!positionConfirmed}
          >
            {hasMismatch && currentPart.status === 'pass'
              ? '确认核验（将标记需复核）'
              : '确认核验结果'}
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default VerifyPage;
