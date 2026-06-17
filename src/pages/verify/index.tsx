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
    setSearchSerial,
    setAircraftNo,
    setPosition,
    setPositionConfirmed,
    verifyPart,
    confirmVerify,
    resetState
  } = useVerifyStore();

  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (searchSerial) {
      setInputValue(searchSerial);
    }
  }, [searchSerial]);

  useDidShow(() => {
    console.log('[VerifyPage] 页面显示');
    if (searchSerial && !currentPart) {
      handleVerify();
    }
  });

  const handleScan = useCallback(() => {
    console.log('[VerifyPage] 点击扫描');
    Taro.scanCode({
      onlyFromCamera: false,
      scanType: ['barCode', 'qrCode'],
      success: (res) => {
        console.log('[VerifyPage] 扫描成功:', res.result);
        const code = res.result.toUpperCase();
        setInputValue(code);
        setSearchSerial(code);
        handleVerifyWithSerial(code);
      },
      fail: (err) => {
        console.error('[VerifyPage] 扫描失败:', err);
        Taro.showToast({ title: '扫描取消', icon: 'none' });
      }
    });
  }, [setSearchSerial]);

  const handleVerifyWithSerial = useCallback(async (serial: string) => {
    if (!validateSerialNumber(serial)) {
      console.warn('[VerifyPage] 序号格式不正确:', serial);
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
    console.log('[VerifyPage] 快速输入:', sn);
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
  }, [positionConfirmed, confirmVerify, resetState]);

  const handlePositionEdit = useCallback(() => {
    Taro.showModal({
      title: '修改位置',
      editable: true,
      placeholderText: '请输入实际位置',
      content: position,
      success: (res) => {
        if (res.confirm && res.content) {
          console.log('[VerifyPage] 修改位置为:', res.content);
          setPosition(res.content.trim());
        }
      }
    });
  }, [position, setPosition]);

  const handleReport = useCallback(() => {
    console.log('[VerifyPage] 跳转异常上报');
    const reportState = useReportStore.getState();
    reportState.setSerialNumber(searchSerial);
    reportState.setReportType('noRecord');
    Taro.switchTab({ url: '/pages/report/index' });
  }, [searchSerial]);

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
            
            <VerifyResult
              part={currentPart}
              aircraftNo={aircraftNo}
              position={position}
              positionConfirmed={positionConfirmed}
              onConfirm={handleConfirmVerify}
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
              <Text className={styles.highlight}>{aircraftNo}</Text> 
              和安装位置 
              <Text className={styles.highlight} onClick={(e) => { e.stopPropagation(); handlePositionEdit(); }}>
                {position}
              </Text>
              与实际情况一致
            </Text>
          </View>
          
          <Button
            className={classnames(
              styles.confirmBtn,
              positionConfirmed && styles.confirmBtnEnabled
            )}
            onClick={handleConfirmVerify}
            disabled={!positionConfirmed}
          >
            确认核验结果
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default VerifyPage;
